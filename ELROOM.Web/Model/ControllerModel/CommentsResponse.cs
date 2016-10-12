using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model.ControllerModel
{
    public class CommentsResponse
    {
        public IEnumerable<Comment> Comments { get; set; }
        public int TotalCount { get; set; }
    }
}
