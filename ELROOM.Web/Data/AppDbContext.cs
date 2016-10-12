using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Threading;
using System.Threading.Tasks;
using ELROOM.Web.Model;
using Microsoft.AspNetCore.Identity.EntityFramework6;

namespace ELROOM.Web.Data
{
    [DbConfigurationType(typeof(AppDbConfig))]
    public class AppDbContext : IdentityDbContext<AppUser, Role>
    {
        private readonly int userId;

        public DbSet<Group> Groups { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PollOption> PollOptions { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<UserPost> UserPosts { get; set; }
        public DbSet<Invitations> Invitations { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationUser> NotificationUsers { get; set; }

        public AppDbContext(int userId) : base(AppDbConfig.ConnectionString)
        {
            Configuration.LazyLoadingEnabled = false;
            Configuration.UseDatabaseNullSemantics = true;
            this.userId = userId;
        }

        protected override void OnModelCreating(DbModelBuilder builder)
        {
            builder.Conventions.Remove<PluralizingTableNameConvention>();
            builder.Conventions.Add(new RowVersionConvention());

            builder.Entity<AppUser>().HasMany(x => x.UserGroups)
              .WithRequired()
              .HasForeignKey(x => x.UserId);

            builder.Entity<Group>().HasMany(x => x.UserGroups)
              .WithRequired()
              .HasForeignKey(x => x.GroupId)
              .WillCascadeOnDelete(true);

            builder.Entity<Post>().HasMany(x => x.PollOptions)
              .WithOptional()
              .HasForeignKey(x => x.PostId);

            builder.Entity<PollOption>().HasMany(x => x.PollVotes)
            .WithOptional()
            .HasForeignKey(x => x.PollId);

            builder.Entity<Post>().HasMany(x => x.Reactions)
                .WithOptional()
                .HasForeignKey(x => x.PostId);

            builder.Entity<AppUser>().HasMany(x => x.UserPosts)
                .WithRequired()
                .HasForeignKey(x => x.UserId);

            builder.Entity<Group>().HasMany(x => x.UserGroups)
              .WithRequired()
              .HasForeignKey(x => x.GroupId);

            builder.Entity<Group>().HasMany(x => x.Posts)
              .WithRequired()
              .HasForeignKey(x => x.GroupId);

            builder.Entity<Post>().HasMany(x => x.UserPosts)
              .WithRequired()
              .HasForeignKey(x => x.PostId);

            builder.Entity<Post>().HasMany(x => x.Comments)
              .WithOptional()
              .HasForeignKey(x => x.PostId);

            builder.Entity<AppUser>().HasMany(x => x.Invitations)
              .WithOptional()
              .HasForeignKey(x => x.UserId);

            builder.Entity<AppUser>().HasMany(x => x.NotificationUsers)
              .WithOptional()
              .HasForeignKey(x => x.UserId);
            builder.Entity<Notification>();

            builder.Entity<Group>().HasMany(x => x.UserGroups)
              .WithRequired()
              .HasForeignKey(x => x.GroupId);

            builder.Entity<Group>().HasMany(x => x.UserGroups)
              .WithRequired()
              .HasForeignKey(x => x.GroupId)
              .WillCascadeOnDelete(true);
        }

        public override int SaveChanges()
        {
            SetAuditFields();
            SetOwner();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            SetAuditFields();
            SetOwner();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void SetOwner()
        {
            foreach (var entry in ChangeTracker.Entries<IOwnable>())
            {
                var entity = entry.Entity;
                if (entry.State == EntityState.Added)
                {
                    entity.OwnerId = this.userId;
                }
            }
        }

        private void SetAuditFields()
        {
            var now = DateTime.UtcNow;
            foreach (var entry in ChangeTracker.Entries<IAuditable>())
            {
                var entity = entry.Entity;
                switch (entry.State)
                {
                    case EntityState.Added:
                        entity.CreationDate = now;
                        goto case EntityState.Modified;
                    case EntityState.Modified:
                        entity.ModificationDate = now;
                        break;
                }
            }
        }
    }
}