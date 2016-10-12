using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using ELROOM.Web.Infrastructure;
using ELROOM.Web.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Data.Entity;
using ELROOM.Web.Model.ControllerModel;
using RefactorThis.GraphDiff;
using System.Data.Entity.Infrastructure;

namespace ELROOM.Web.Controllers
{
    [Route("api/[controller]")]
    public class GroupController : ApiController
    {
        public GroupController(AppDbContext db, IOptions<Settings> settings) : base(db, settings)
        {
        }

        [HttpGet("loadGroup{id}")]
        public Group LoadGroup(int id)
        {
            var userId = User.GetId();
            var g = db.Groups.Include(x => x.UserGroups)
                .Include(x => x.Posts.Select(p => p.PollOptions.Select(y => y.PollVotes)))
                .Include(x => x.Posts.Select(p => p.Reactions))
                .Include(x => x.Posts.Select(p => p.UserPosts))
                .Include(x => x.Posts.Select(p => p.Owner))
                .FirstOrDefault(x => x.Id == id);
            if (g.Private && !g.UserGroups.Any(u => u.UserId == userId))
            {
                throw new BusinessException("post:message.group_not_found");
            }
            return g;
        }

        [HttpPost("updateGroup")]
        public Group UpdateGroup([FromBody] Group groupRequest)
        {
            var userId = User.GetId();
            var dbGroup = db.Groups.FirstOrDefault(g => g.Id == groupRequest.Id && g.OwnerId == userId);
            if (dbGroup != null && groupRequest.Id > 0 || dbGroup == null && groupRequest.Id == 0)
            {
                try
                {
                    if (dbGroup != null)
                    {
                        if (groupRequest.UploadImage != groupRequest.Id.ToString())
                        {
                            dbGroup.Image = GetImageFromClient(groupRequest.UploadImage, groupRequest.Id);
                        }
                        dbGroup.Name = groupRequest.Name;
                        dbGroup.Description = groupRequest.Description;
                        dbGroup.Private = groupRequest.Private;
                    }
                    else
                    {
                        groupRequest.Image = GetImageFromClient(groupRequest.UploadImage, groupRequest.Id);
                        groupRequest.UserGroups.Add(new UserGroup { UserId = userId, Group = groupRequest });
                        db.Groups.Add(groupRequest);
                    }

                    db.SaveChanges();
                    return dbGroup != null ? dbGroup : groupRequest;
                }
                catch (DbUpdateException dbe)
                {
                    if (dbe.IsUniqueConstraintViolation())
                    {
                        throw new BusinessException("group:message.duplicate_name");
                    }

                    throw dbe;
                }
            }
            else
            {
                throw new BusinessException("group:message.group_not_found");
            }
        }

        [HttpPost("deleteGroup")]
        public bool DeleteGroup([FromBody] Group group)
        {
            var userId = User.GetId();
            var dbGroup = db.Groups.FirstOrDefault(g => g.Id == group.Id && g.OwnerId == userId && !g.UserGroups.Any());
            if (dbGroup != null)
            {
                db.Groups.Remove(dbGroup);
                db.SaveChanges();
                return true;
            }
            else
            {
                throw new BusinessException("group:message.cannot_delete_group");
            }
        }

        [HttpGet("getFullImage{id}")]
        public FileResult GetFullImage(int id)
        {
            var group = db.Groups.FirstOrDefault(g => g.Id == id);
            return PhotoHelper.GetPhotoResponse(group.Image);
        }

        [HttpGet("getThumb{id}")]
        public FileResult GetThumb(int id)
        {
            var group = db.Groups.FirstOrDefault(g => g.Id == id);
            return PhotoHelper.GetPhotoResponse(PhotoHelper.GetPhotoThumb(group.Image, 40));
        }

        [HttpPost("followGroup")]
        public Group FollowGroup([FromBody] Group group)
        {
            var dbgroup = db.Groups.Include(g => g.UserGroups).FirstOrDefault(g => g.Id == group.Id);
            if (dbgroup != null)
            {
                dbgroup.UserGroups.Add(new UserGroup { UserId = User.GetId(), GroupId = group.Id });
                db.SaveChanges();
                return dbgroup;
            }
            else
            {
                throw new BusinessException("common:message.group_not_found");
            }
        }

        [HttpPost("unfollowGroup")]
        public Group UnfollowGroup([FromBody]Group group)
        {
            var dbgroup = db.Groups.Include(g => g.UserGroups).FirstOrDefault(g => g.Id == group.Id);
            if (dbgroup != null)
            {
                var userId = User.GetId();
                group.UserGroups = dbgroup.UserGroups.Where(ug => ug.UserId != userId).ToList();
                db.UpdateGraph(group, map => map.OwnedCollection(x => x.UserGroups));
                db.SaveChanges();
                return group;
            }
            else
            {
                throw new BusinessException("common:message.group_not_found");
            }
        }

        [HttpPost("favorGroup")]
        public Group FavorGroup([FromBody]Group group)
        {
            var dbgroup = db.Groups.Include(g => g.UserGroups).FirstOrDefault(g => g.Id == group.Id);
            if (dbgroup != null)
            {
                var userId = User.GetId();
                var ug = dbgroup.UserGroups.FirstOrDefault(x => x.GroupId == group.Id && x.UserId == userId);
                ug.Favorite = true;
                db.SaveChanges();
                return dbgroup;
            }
            else
            {
                throw new BusinessException("common:message.group_not_found");
            }
        }

        [HttpPost("unfavorGroup")]
        public Group UnFavorGroup([FromBody]Group group)
        {
            var dbgroup = db.Groups.Include(g => g.UserGroups).FirstOrDefault(g => g.Id == group.Id);
            if (dbgroup != null)
            {
                var userId = User.GetId();
                var ug = dbgroup.UserGroups.FirstOrDefault(x => x.GroupId == group.Id && x.UserId == userId);
                ug.Favorite = false;
                db.SaveChanges();
                return dbgroup;
            }
            else
            {
                throw new BusinessException("common:message.group_not_found");
            }
        }

        [HttpGet("getGroupUsers{id}")]
        public IEnumerable<AppUser> GetGroupUser(int id)
        {
            var users = db.Users.Where(u => u.UserGroups.Any(g => g.GroupId == id));
            return users;
        }

        [HttpGet("getOthersUsers{id}")]
        public IEnumerable<AppUser> GetOtherUsers(int id)
        {
            var users = db.Users.Where(u => u.UserGroups.All(g => g.GroupId != id));
            return users;
        }

        [HttpGet("getUserGroupData{currentGroupType,currentGroupCount}")]
        public GroupDataResponse GetUserGroupData(string currentGroupType, int currentGroupCount)
        {
            const int MAX_ROW = 5;
            var userId = User.GetId();
            var groups = db.Groups.Include(x => x.UserGroups).ToList();
            switch (currentGroupType)
            {
                case "favorite":
                    return new GroupDataResponse {
                        FavoriteGroups = groups.Where(g => g.UserGroups.Any(x => x.UserId == userId && x.Favorite)).Take(MAX_ROW + currentGroupCount)
                    };
                case "following":
                    return new GroupDataResponse {
                        FollowingGroups = groups.Where(g => g.UserGroups.Any(x => x.UserId == userId)).Take(MAX_ROW + currentGroupCount),
                    };
                case "public":
                    return new GroupDataResponse {
                        PublicGroups = groups.Where(g => !g.UserGroups.Any(x => x.UserId == userId) && g.OwnerId != userId && !g.Private)
                      .OrderByDescending(g => g.UserGroups.Count).Take(MAX_ROW + currentGroupCount),
                    };
                case "owned":
                    return new GroupDataResponse {
                        OwnedGroups = groups.Where(g => g.OwnerId == userId).Take(MAX_ROW + currentGroupCount)
                    };
                default:
                    return new GroupDataResponse {
                        FavoriteGroups = groups.Where(g => g.UserGroups.Any(x => x.UserId == userId && x.Favorite)).Take(MAX_ROW),
                        FollowingGroups = groups.Where(g => g.UserGroups.Any(x => x.UserId == userId)).Take(MAX_ROW),
                        PublicGroups = groups.Where(g => !g.UserGroups.Any(x => x.UserId == userId) && g.OwnerId != userId && !g.Private).OrderByDescending(g => g.UserGroups.Count).Take(MAX_ROW),
                        OwnedGroups = groups.Where(g => g.OwnerId == userId).Take(MAX_ROW)
                    };
            }
        }

        [HttpGet("getGroupPosts{groupId}")]
        public IEnumerable<Post> GetGroupPosts(int groupId)
        {
            return db.Posts.Include(x => x.Reactions)
                .Include(x => x.UserPosts)
                .Where(p => p.GroupId == groupId);
        }

        [HttpPost("deleteGroupUser")]
        public IEnumerable<AppUser> DeleteGroupUser(int userId, [FromBody]Group group)
        {
            var dbgroup = db.Groups.Include(x => x.UserGroups).FirstOrDefault(g => g.Id == group.Id);
            if (dbgroup.OwnerId != User.GetId())
            {
                return GetGroupUser(group.Id);
            }
            if (dbgroup != null)
            {
                group.UserGroups = dbgroup.UserGroups.Where(ug => ug.UserId != userId).ToList();
                db.UpdateGraph(group, map => map.OwnedCollection(x => x.UserGroups));
                db.SaveChanges();
                return GetGroupUser(group.Id);
            }
            else
            {
                throw new BusinessException("common:message.group_not_found");
            }
        }

        [HttpPost("inviteUser")]
        public void InviteUser(int userId, int groupId)
        {
            var dbgroup = db.Groups.Include(g => g.Invitations).FirstOrDefault(g => g.Id == groupId);
            if (dbgroup != null)
            {
                if (dbgroup.Invitations.Any(i => i.UserId == userId && i.GroupId == groupId))
                {
                    return;
                }

                dbgroup.Invitations.Add(new Invitations { UserId = userId, GroupId = groupId });
                db.SaveChanges();
            }
            else
            {
                throw new BusinessException("common:message.group_not_found");
            }
        }

        [HttpPost("addGroupUser")]
        public AppUser AddGroupUser([FromBody]AppUser user, [FromBody]Group group)
        {
            var dbgroupuser = db.UserGroups.FirstOrDefault(ug => ug.UserId == user.Id && ug.GroupId == group.Id);
            if (dbgroupuser != null)
            {
                db.UpdateGraph(dbgroupuser);
                db.SaveChanges();
                return user;
            }
            else
            {
                throw new BusinessException("common:message.group_not_found");
            }
        }
    }
}
