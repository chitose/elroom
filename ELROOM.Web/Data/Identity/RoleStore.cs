﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using ELROOM.Web.Infrastructure;

namespace Microsoft.AspNetCore.Identity.EntityFramework6
{
  public class RoleStore<TUser, TRole, TContext> : IRoleStore<TRole>, IRoleClaimStore<TRole>
    where TUser : IdentityUser<TRole>
    where TRole : IdentityRole
    where TContext : IdentityDbContext<TUser, TRole>
  {
    public TContext Context { get; }

    public RoleStore(TContext context)
    {
      Context = context;
    }

    public Task AddClaimAsync(TRole role, Claim claim, CancellationToken cancellationToken = default(CancellationToken))
    {
      throw new NotImplementedException();
    }

    public Task<IdentityResult> CreateAsync(TRole role, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task<IdentityResult> DeleteAsync(TRole role, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public void Dispose()
    {
    }

    public Task<TRole> FindByIdAsync(string roleId, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task<TRole> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
    {
      return Context.Roles.FirstOrDefaultAsync(r => r.Name == normalizedRoleName);
    }

    public Task<IList<Claim>> GetClaimsAsync(TRole role, CancellationToken cancellationToken = default(CancellationToken))
    {
      return Task.FromResult<IList<Claim>>(Context.Entry(role)
                                                  .Collection(r => r.Rights)
                                                  .Query()
                                                  .AsEnumerable()
                                                  .Select(p => new Claim(Claims.Right, p.Right.ToString("d")))
                                                  .ToList());
    }

    public Task<string> GetNormalizedRoleNameAsync(TRole role, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task<string> GetRoleIdAsync(TRole role, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task<string> GetRoleNameAsync(TRole role, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task RemoveClaimAsync(TRole role, Claim claim, CancellationToken cancellationToken = default(CancellationToken))
    {
      throw new NotImplementedException();
    }

    public Task SetNormalizedRoleNameAsync(TRole role, string normalizedName, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task SetRoleNameAsync(TRole role, string roleName, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task<IdentityResult> UpdateAsync(TRole role, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }
  }
}