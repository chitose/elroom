using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using ELROOM.Web.Infrastructure;
using ELROOM.Web.Model;
using ELROOM.Web.Model.ControllerModel;
using Microsoft.AspNetCore.Mvc;
using System.Data.Entity;
using Microsoft.Extensions.Options;
using RefactorThis.GraphDiff;


namespace ELROOM.Web.Controllers
{
    [Route("api/[controller]")]
    public class PostController : ApiController
    {
        public PostController(AppDbContext db, IOptions<Settings> settings) : base(db, settings)
        {
        }

        [HttpGet("GetPost{id}")]
        public Post GetPost(int id)
        {
            return db.Posts
                .Include(p => p.Owner)
                .Include(p => p.PollOptions)
                .Include(p => p.PollOptions.Select(y => y.PollVotes))
                .Include(p => p.Reactions)
                .Include(p => p.UserPosts)
                .FirstOrDefault(x => x.Id == id);
        }

        [HttpGet("getFullImage{id}")]
        public FileResult GetFullImage(int id)
        {
            var post = db.Posts.FirstOrDefault(x => x.Id == id);
            return PhotoHelper.GetPhotoResponse(post.Image);
        }

        [HttpGet("getCommentImage{id}")]
        public FileResult GetCommentImage(int id)
        {
            var c = db.Comments.FirstOrDefault(x => x.Id == id);
            return PhotoHelper.GetPhotoResponse(c.Image, "blank.png");
        }

        [HttpPost("createOrUpdatePost")]
        public Post CreateOrUpdatePost([FromBody]Post request)
        {
            var userId = User.GetId();
            var dbPost = db.Posts.FirstOrDefault(p => p.Id == request.Id && p.OwnerId == userId);
            request.Image = GetImageFromClient(request.UploadImage, request.Id);

            if (!string.IsNullOrEmpty(request.PostPollOptions) && request.Id == 0)
            {
                var polls = request.PostPollOptions.Split('\n');
                request.PollOptions = new List<PollOption>();
                foreach (var p in polls)
                {
                    request.PollOptions.Add(new PollOption { Content = p, Post = request });
                }
            }
            if (dbPost != null)
            {
                dbPost.Title = request.Title;
                dbPost.Content = request.Content;
                if (request.UploadImage != request.Id.ToString())
                {
                    dbPost.Image = request.Image;
                }
            }
            else
            {
                db.Posts.Add(request);
                db.SaveChanges();
                db.UserPosts.Add(new UserPost()
                {
                    PostId = request.Id,
                    UserId = userId
                });
                request.Owner = db.Users.First(u => u.Id == userId);
            }

            db.SaveChanges();
            if (dbPost != null)
            {
                request.RowVersion = dbPost.RowVersion;
            }
            return request;
        }

        [HttpPost("deletePost")]
        public bool DeletePost([FromBody]Post request)
        {
            var userId = User.GetId();
            var dbPost = db.Posts.Include(p => p.Comments).FirstOrDefault(p => p.Id == request.Id && p.OwnerId == userId);
            if (dbPost != null)
            {
                var dbPostComments = dbPost.Comments.Where(c => c.PostId == request.Id);
                request.Comments = dbPost.Comments.Where(c => c.PostId != request.Id).ToList();
                db.UpdateGraph(request, map => map.OwnedCollection(x => x.Comments));
                db.Posts.Remove(dbPost);
                db.SaveChanges();
                return true;
            }
            else
            {
                throw new BusinessException("group:message.cannot_delete_group");
            }
        }

        [HttpPost("vote{id}")]
        public PollVote Vote(int id, [FromBody] PollVote pollVote)
        {
            var userId = User.GetId();
            var po = db.PollOptions.FirstOrDefault(x => x.PostId == id && x.Id == pollVote.PollId && !x.PollVotes.Any(y => y.OwnerId == userId));
            if (po != null)
            {
                po.PollVotes.Add(pollVote);
                db.SaveChanges();
                return pollVote;
            }
            throw new BusinessException("post:Invalid vote");
        }

        [HttpPost("reactPost")]
        public Reaction ReactPost([FromBody]Reaction reaction)
        {
            var userId = User.GetId();
            var re = db.Reactions.FirstOrDefault(x => x.Id == reaction.Id);
            if (re != null)
            {
                //update
                re.Type = reaction.Type;
            }
            else
            {
                //add
                re = db.Reactions.Add(reaction);
            }
            if (reaction.Type != ReactionType.NoState)
            {
                if (reaction.PostId.HasValue)
                {
                    var postId = reaction.PostId.Value;
                    var post = db.Posts.FirstOrDefault(p => p.Id == postId);
                    if (post != null)
                    {
                        var notification = new Notification()
                        {
                            AuthorId = userId,
                            PostId = reaction.PostId.Value,
                            CreationDate = DateTime.Now,
                            Content = reaction.Type == ReactionType.Like ? "liked" : "disliked"
                        };
                        db.Notifications.Add(notification);
                        db.SaveChanges();

                        db.NotificationUsers.Add(new NotificationUser()
                        {
                            NotificationId = notification.Id,
                            UserId = post.OwnerId,
                            IsNew = true,
                            CreationDate = DateTime.Now
                        });
                    }

                }
            }
            db.SaveChanges();
            return re;
        }

        [HttpPost("followPost")]
        public UserPost FollowPost([FromBody] UserPost post)
        {
            var userPost = db.UserPosts.FirstOrDefault(p => p.Id == post.Id);
            if (userPost != null)
            {
                db.UserPosts.Remove(userPost);
            }
            else
            {
                db.UserPosts.Add(post);
                userPost = post;
            }
            db.SaveChanges();
            return userPost;
        }

        [HttpPost("postComment")]
        public Comment PostComment([FromBody] Comment comment)
        {

            var userId = User.GetId();
            var post = db.Posts.Include(p => p.UserPosts).FirstOrDefault(p => p.Id == comment.PostId && p.Group.UserGroups.Any(ug => ug.UserId == userId));
            if (post != null)
            {
                comment.Image = GetImageFromClient(comment.UploadImage, comment.Id);
                if (string.IsNullOrEmpty(comment.Content)
                    && comment.Image == null && string.IsNullOrEmpty(comment.Sticker))
                {
                    throw new BusinessException("post:message.invalid_comment");
                }
                db.Comments.Add(comment);

                var userPost = post.UserPosts.FirstOrDefault(p => p.UserId == userId);
                if (userPost == null)
                {
                    post.UserPosts.Add(new UserPost() { PostId = post.Id, UserId = userId });
                }
            
                var notification = new Notification() {
                    AuthorId = userId,
                    PostId = comment.PostId,
                    CreationDate = DateTime.Now,
                    Content = "comment"
                };
          
                db.Notifications.Add(notification);
                db.SaveChanges();

                foreach(var user in post.UserPosts)
                {
                    if (user.UserId != userId)
                    {
                        db.NotificationUsers.Add(new NotificationUser()
                        {
                            NotificationId = notification.Id,
                            UserId = user.UserId,
                            IsNew = true,
                        });
                    }
                }

                db.SaveChanges();
                return comment;
            }
            else
            {
                throw new BusinessException("post:message.invalid_comment");
            }
        }

        [HttpGet("getComments{id,offset,length}")]
        public CommentsResponse GetComments(int id, int offset, int length)
        {
            var data = db.Comments.Include(x => x.Owner).Where(c => c.PostId == id).OrderByDescending(x => x.CreationDate);
            var list = data.Skip(offset).Take(length).ToList();
            list.Reverse();
            return new CommentsResponse {
                TotalCount = data.Count(),
                Comments = list
            };
        }

        [HttpGet("getFollowingPosts{offset,length}")]
        public PostsReponseData GetFollowingPosts(int offset, int length)
        {
            var userId = User.GetId();
            var query = db.Posts
                .Include(x => x.PollOptions.Select(p => p.PollVotes))
                .Include(x => x.UserPosts)
                .Include(x => x.Reactions)
                .Include(x => x.Owner)
                .Where(p => p.UserPosts.Any(u => u.UserId == userId))
                .OrderByDescending(p => p.LastCommentDate);
            return new PostsReponseData {
                TotalCount = query.Count(),
                Posts = query.Skip(offset).Take(length)
            };
        }

        [HttpGet("getHostPosts{offset,length}")]
        public PostsReponseData GetHostPosts(int offset, int length)
        {
            var userId = User.GetId();
            var query = db.Posts
                .Include(x => x.PollOptions.Select(p => p.PollVotes))
                .Include(x => x.UserPosts)
                .Include(x => x.Reactions)
                .Include(x => x.Owner)
                .Where(p => !p.Group.Private || p.Group.Private && p.Group.UserGroups.Any(pg => pg.UserId == userId))
                .OrderByDescending(p => p.LastCommentDate);
            return new PostsReponseData {
                TotalCount = query.Count(),
                Posts = query.Skip(offset).Take(length)
            };
        }

        [HttpGet("getPostPolls{offset,length}")]
        public PostsReponseData GetPostWithPolls(int offset, int length)
        {
            var userId = User.GetId();
            var now = DateTime.UtcNow;
            var query = db.Posts
                .Include(x => x.PollOptions.Select(p => p.PollVotes))
                .Include(x => x.UserPosts)
                .Include(x => x.Reactions)
                .Include(x => x.Owner)
                .Where(p => p.PollOptions.Any() && (p.PollStart == null || p.PollStart >= now)
                && (p.PollEnd == null || p.PollEnd >= now)
                && (!p.Group.Private || p.Group.Private && p.Group.UserGroups.Any(pg => pg.UserId == userId)))
                .OrderByDescending(p => p.LastCommentDate);
            return new PostsReponseData {
                TotalCount = query.Count(),
                Posts = query.Skip(offset).Take(length)
            };
        }
    }
}