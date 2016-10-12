using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using Microsoft.Extensions.Options;
using ELROOM.Web.Model;
using ELROOM.Web.Infrastructure;
using System.Data.Entity;
using ELROOM.Web.Model.ControllerModel;

namespace ELROOM.Web.Controllers
{
    [Route("api/[controller]")]
    public class NotificationController : ApiController
    {
        public NotificationController(AppDbContext db, IOptions<Settings> settings) : base(db, settings)
        {

        }

        [HttpGet("GetNotification{clearNew, currentItemCount}")]
        public IEnumerable<NotificationResponse> GetNotification(bool clearNew, int currentItemCount)
        {
            const int MAX_NOTIFICATION = 5;
            var result = new List<NotificationResponse>();
            var userId = User.GetId();
            var notificationUsers = db.NotificationUsers
                .Include(n => n.Notification)
                .Include(n => n.Notification.Author)
                .Include(n => n.Notification.Post)
                .Include(n => n.Notification.Post.Owner)
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreationDate)
                .Skip(currentItemCount)
                .Take(MAX_NOTIFICATION);
            foreach(var notification in notificationUsers)
            {
                var item = new NotificationResponse()
                {
                    Id = notification.Id,
                    AuthorUserId = notification.Notification.AuthorId,
                    PostId = notification.Notification.PostId,
                    CreationDate = notification.CreationDate,
                    NotificationContent = string.Format("{0} {1} {2}", 
                    notification.Notification.Author.DisplayName, 
                    notification.Notification.Content, 
                    notification.Notification.Post.Owner.Id == userId ? "your post" : string.Format("the post of {0}", notification.Notification.Post.Owner.DisplayName))
                };
                result.Add(item);
                if (clearNew)
                {
                    notification.IsNew = false;
                }
            }
            db.SaveChanges();
            return result;
        }

        [HttpGet("GetNotificationCount")]
        public int GetNotificationCount()
        {
            var userId = User.GetId();
            return db.NotificationUsers.Count(u => u.UserId == userId && u.IsNew == true);
        }

        [HttpGet("ReadNotification{id}")]
        public void ReadNotification(int id)
        {
            var notificationUser = db.NotificationUsers.FirstOrDefault(n => n.Id == id);
            if (notificationUser != null)
            {
                notificationUser.IsRead = true;
                db.SaveChanges();
            }
        }
    }
}
