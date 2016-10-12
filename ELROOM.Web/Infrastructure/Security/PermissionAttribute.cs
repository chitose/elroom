using Microsoft.AspNetCore.Authorization;
using ELROOM.Web.Model;

namespace ELROOM.Web.Infrastructure
{
  public class PermissionAttribute : AuthorizeAttribute
  {
    public PermissionAttribute(Right right)
      : base("Claim:" + right.ToString("d"))
    {
    }
  }
}