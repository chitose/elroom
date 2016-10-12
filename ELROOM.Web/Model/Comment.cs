using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using ELROOM.Web.Infrastructure;
using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
    public class Comment : BaseEntity, IOwnable
    {
        public int OwnerId { get; set; }
        [JsonIgnore]
        public byte[] Image { get; set; }
        public int PostId { get; set; }
        public string Sticker { get; set; }
        public string Content { get; set; }

        public bool HasImage {
            get {
                return Image != null;
            }
        }

        [ForeignKey(nameof(OwnerId))]
        [OptionalModel]
        public AppUser Owner { get; set; }

        [NotMapped]
        public string UploadImage { get; set; }
    }
}
