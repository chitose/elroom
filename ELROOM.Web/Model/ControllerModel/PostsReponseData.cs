using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model.ControllerModel
{
    public class PostsReponseData
    {
        public int TotalCount { get; set; }
        public IEnumerable<Post> Posts { get; set; }
    }
}
