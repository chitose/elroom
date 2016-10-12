using System;
using System.ComponentModel.DataAnnotations;

namespace Microsoft.AspNetCore.Identity.EntityFramework6
{
  /// <summary>
  /// Represents a user in the identity system
  /// </summary>
  public class IdentityUser<TRole>
  {
    /// <summary>
    /// Initializes a new instance of <see cref="IdentityUser{TKey}"/>.
    /// </summary>
    public IdentityUser() { }

    /// <summary>
    /// Initializes a new instance of <see cref="IdentityUser{TKey}"/>.
    /// </summary>
    /// <param name="userName">The user name.</param>
    public IdentityUser(string userName) : this()
    {
      UserName = userName;
    }

    /// <summary>
    /// </summary>
    /// Gets or sets the primary key for this user.
    public virtual int Id { get; set; }

    /// <summary>
    /// Gets or sets the user name for this user.
    /// </summary>
    [Required, MaxLength(256)]
    public virtual string UserName { get; set; }

    [Required, MaxLength(100)]
    public string FirstName { get; set; }

    [Required, MaxLength(100)]
    public string LastName { get; set; }

    [Required]
    public int RoleId { get; set; }

    public TRole Role { get; set; }

    /// <summary>
    /// Gets or sets the email address for this user.
    /// </summary>
    public virtual string Email { get; set; }

    /// <summary>
    /// Gets or sets a salted and hashed representation of the password for this user.
    /// </summary>
    public virtual string PasswordHash { get; set; }

    /// <summary>
    /// A random value that must change whenever a users credentials change (password changed, login removed)
    /// </summary>
    public virtual string SecurityStamp { get; set; }

    /// <summary>
    /// Gets or sets a telephone number for the user.
    /// </summary>
    public virtual string Phone { get; set; }

    /// <summary>
    /// Gets or sets the date and time, in UTC, when any user lockout ends.
    /// </summary>
    /// <remarks>
    /// A value in the past means the user is not locked out.
    /// </remarks>
    public virtual DateTimeOffset? LockoutEnd { get; set; }

    /// <summary>
    /// Gets or sets a flag indicating if this user is locked out.
    /// </summary>
    /// <value>True if the user is locked out, otherwise false.</value>
    public virtual bool LockoutEnabled { get; set; }

    /// <summary>
    /// Gets or sets the number of failed login attempts for the current user.
    /// </summary>
    public virtual int AccessFailedCount { get; set; }
  }
}