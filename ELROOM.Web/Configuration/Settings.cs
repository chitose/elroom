using Microsoft.AspNetCore.Identity;

namespace ELROOM.Web.Configuration
{
  public class Settings
  {
    public bool EnableSQLLog { get; set; }
    public bool EnableWindowsAuth { get; set; }
    public string AutoCreateUserForDomain { get; set; }
    public string LdapRootUrl { get; set; }
    public string LdapUserName { get; set; }
    public string LdapPassword { get; set; }
    public string LdapUserRoot { get; set; }
  }
}