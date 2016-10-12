using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ELROOM.Web.Infrastructure;
using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
    public class Group : BaseEntity, IOwnable
    {
        public int OwnerId {
            get; set;
        }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [JsonIgnore]
        public byte[] Image { get; set; }

        public bool Private { get; set; }

        public bool HasImage {
            get { return Image != null; }
        }

        [NotMapped]
        [OptionalModel]
        public string UploadImage { get; set; }

        [MaxLength(2000)]
        public string Description { get; set; }

        public Group()
        {
            UserGroups = new HashSet<UserGroup>();
            Posts = new HashSet<Post>();
            Invitations = new HashSet<Invitations>();
        }

        public virtual ICollection<UserGroup> UserGroups { get; set; }

        public virtual ICollection<Post> Posts { get; set; }

        public virtual ICollection<Invitations> Invitations { get; set; }
    }
}
