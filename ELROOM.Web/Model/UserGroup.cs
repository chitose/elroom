using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
  public class UserGroup : BaseEntity
  {
    public int UserId { get; set; }
    public int GroupId { get; set; }
    public bool Favorite { get; set; }

    [JsonIgnore]
    public virtual AppUser User { get; set; }
    [JsonIgnore]
    public virtual Group Group { get; set; }
  }
}
