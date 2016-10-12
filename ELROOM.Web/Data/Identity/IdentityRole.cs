using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ELROOM.Web.Model;

namespace Microsoft.AspNetCore.Identity.EntityFramework6
{
  public class IdentityRole
  {
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public ICollection<RoleRight> Rights { get; set; }
  }
}