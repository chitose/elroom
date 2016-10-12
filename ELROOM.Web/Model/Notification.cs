using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model
{
  public class Notification : BaseEntity
  {
    public int AuthorId { get; set; }
    public int PostId { get; set; }
    public string Content { get; set; }


    [JsonIgnore]
    public virtual AppUser Author { get; set; }
    [JsonIgnore]
    public virtual Post Post { get; set; }
  }
}
