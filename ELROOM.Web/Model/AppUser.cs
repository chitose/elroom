using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Identity.EntityFramework6;
using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
    public class AppUser : IdentityUser<Role>, IAuditable
    {
        [JsonIgnore]
        public byte[] Avatar { get; set; }
        public string Options { get; set; }

        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public byte[] RowVersion { get; set; }

        public AppUser()
        {
            UserGroups = new HashSet<UserGroup>();
        }

        public string DisplayName {
            get {
                return $"{LastName} {FirstName}";
            }
        }

    	[JsonIgnore]
    	public virtual ICollection<UserGroup> UserGroups { get; set; }
    	[JsonIgnore]
    	public virtual ICollection<UserPost> UserPosts { get; set; }
    	[JsonIgnore]
    	public virtual ICollection<Invitations> Invitations { get; set; }
    	[JsonIgnore]
    	public virtual ICollection<NotificationUser> NotificationUsers { get; set; }
  }
}