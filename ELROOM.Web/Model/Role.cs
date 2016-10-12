using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFramework6;
using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
  public class Role : IdentityRole, IAuditable
  {
    public Role()
    {
      Users = new HashSet<AppUser>();
    }    
    public string Remarks { get; set; }

    
    public DateTime CreationDate { get; set; }    
    public DateTime ModificationDate { get; set; }
    public byte[] RowVersion { get; set; }

    [JsonIgnore]
    public ICollection<AppUser> Users { get; set; }
  }
}