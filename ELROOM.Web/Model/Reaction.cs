using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model
{
    public class Reaction : BaseEntity, IOwnable
    {
        public int? PostId { get; set; }
        public int? CommentId { get; set; }
        public int OwnerId { get; set; }
        public ReactionType Type { get; set; }
    }
}
