using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model.ControllerModel
{
    public class NotificationResponse
    {
        public int Id { get; set; }
        public int AuthorUserId { get; set; }
        public int PostId { get; set; }
        public string NotificationContent { get; set; }
        public DateTime CreationDate { get; set; }
        public bool IsRead { get; set; }
    }
}
