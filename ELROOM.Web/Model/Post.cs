using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ELROOM.Web.Infrastructure;
using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
    public class Post : BaseEntity, IOwnable
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int GroupId { get; set; }
        public int OwnerId { get; set; }
        public DateTime? PollStart { get; set; }
        public DateTime? PollEnd { get; set; }
        [JsonIgnore]
        public byte[] Image { get; set; }
        public string HasImage {
            get { return Image != null ? Id.ToString() : string.Empty; }
        }
        public Post()
        {
            PollOptions = new HashSet<PollOption>();
        }
        public virtual ICollection<Reaction> Reactions { get; set; }
        public virtual ICollection<UserPost> UserPosts { get; set; }
        public virtual ICollection<PollOption> PollOptions { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [OptionalModel]
        public DateTime? LastCommentDate { get; set; }

        [OptionalModel]
        [JsonIgnore]
        public virtual ICollection<Comment> Comments { get; set; }

        public bool hasPoll {
            get { return PollOptions.Count > 0; }
        }

        public bool Pollable {
            get {
                var now = DateTime.UtcNow;
                return (this.PollStart == null || this.PollStart <= now)
                    && (this.PollEnd == null || this.PollEnd >= now);
            }
        }

        [NotMapped]
        [OptionalModel]
        public string UploadImage { get; set; }

        [NotMapped]
        [OptionalModel]
        public string PostPollOptions { get; set; }

        [ForeignKey(nameof(OwnerId))]
        [OptionalModel]
        public AppUser Owner { get; set; }
        [JsonIgnore]
        [ForeignKey(nameof(GroupId))]
        public Group Group { get; set; }
    }
}
