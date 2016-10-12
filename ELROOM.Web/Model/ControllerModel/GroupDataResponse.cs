using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model.ControllerModel
{
  public class GroupDataResponse
  {
    public IEnumerable<Group> FavoriteGroups { get; set; }
    public IEnumerable<Group> FollowingGroups { get; set; }
    public IEnumerable<Group> PublicGroups { get; set; }
    public IEnumerable<Group> OwnedGroups { get; set; }
  }
}
