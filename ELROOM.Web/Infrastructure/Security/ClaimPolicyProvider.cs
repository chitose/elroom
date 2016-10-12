using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace ELROOM.Web.Infrastructure
{
  public class ClaimPolicyProvider : IAuthorizationPolicyProvider
  {
    public Task<AuthorizationPolicy> GetDefaultPolicyAsync()
    {
      return Task.FromResult(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());
    }

    public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
    {
      if (!policyName.StartsWith("Claim:", StringComparison.Ordinal))
        throw new NotSupportedException("Unsupported policy: " + policyName);

      return Task.FromResult(new AuthorizationPolicyBuilder().RequireClaim(Claims.Right, policyName.Substring("Claim:".Length)).Build());
    }
  }
}