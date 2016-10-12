using System.Security.Claims;
using ELROOM.Web.Model;

namespace ELROOM.Web.Infrastructure
{
  public static class Claims
  {
    public const string Right = "reactspa/right";
    public const string DisplayName = "reactspa/displayName";

    // Note: this method has been moved in ASP.NET RC2 to UserManager instances,
    //       but this creates an annoying circularity with RFNetDatabase (see the scoped instance in Startup.cs)
    //       so I'm duplicating here outside.
    //       The only drawback is that we can't override the claims name anymore, but we don't anyway...
    public static int GetId(this ClaimsPrincipal identity)
    {
      string userId = identity?.FindFirstValue(ClaimTypes.NameIdentifier);
      if (userId == null)
        return 0;
      return int.Parse(userId);
    }

    public static string GetUsername(this ClaimsPrincipal identity)
      => identity?.FindFirstValue(ClaimTypes.Name) ?? "N/A";

    public static string GetFullName(this ClaimsPrincipal identity)
      => identity?.FindFirstValue(DisplayName) ?? "N/A";

    public static bool HasRight(this ClaimsPrincipal identity, Right right)
      => identity?.HasClaim(Right, right.ToString("d")) ?? false;
  }
}