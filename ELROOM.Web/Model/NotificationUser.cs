using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model
{
  public class NotificationUser : BaseEntity
  {
    public int NotificationId { get; set; }
    public int UserId { get; set; }
    public bool IsNew { get; set; }
    public bool IsRead { get; set; }
    [JsonIgnore]
    public virtual AppUser User { get; set; }
    [JsonIgnore]
    public virtual Notification Notification { get; set; }
  }
}
