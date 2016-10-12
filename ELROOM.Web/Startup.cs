using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFramework6;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NLog;
using NLog.Config;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using ELROOM.Web.Infrastructure;
using ELROOM.Web.Model;

namespace ELROOM.Web
{
  public class Startup
  {
    private static Settings settings = new Settings();

    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
          .AddEnvironmentConfig("envsettings.json", env.ContentRootPath);

      if (env.IsDevelopment())
        builder.AddUserSecrets();

      Configuration = builder.Build();

      Configuration.GetSection("Settings").Bind(settings);

      var logConfig = new XmlLoggingConfiguration(Path.Combine(env.ContentRootPath, "NLog.config"));
      LogManager.Configuration = logConfig;
      Loggers.Default.Info("Starting ELROOM.WEB");
      AppDbConfig.ConnectionString = Configuration["Data:Connection"];
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services
        .Configure<Settings>(Configuration.GetSection("Settings"))
        .AddSingleton<IAuthorizationPolicyProvider, ClaimPolicyProvider>()
        .AddScoped(provider => {
          var user = provider.GetService<IHttpContextAccessor>()?.HttpContext?.User;
          return new AppDbContext(user.GetId());
        })
        .AddIdentity<AppUser, Role>(options => {
          var cookie = options.Cookies.ApplicationCookie;
          cookie.CookieName = "ELROOM.Web.Auth" + (settings.EnableWindowsAuth ? "Win" : "");
          cookie.ExpireTimeSpan = TimeSpan.FromHours(1);
          cookie.Events = new CookieAuthenticationEvents {
            OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; },
            OnRedirectToAccessDenied = context => { context.Response.StatusCode = 403; return Task.CompletedTask; },
          };
        })
          .AddUserStore<UserStore<AppUser, Role, AppDbContext>>()
          .AddRoleStore<RoleStore<AppUser, Role, AppDbContext>>()
          .AddDefaultTokenProviders();

      services.AddMvc(options => {
        options.OutputFormatters.RemoveType<StringOutputFormatter>();
        options.Filters.Add(new ResponseCacheFilter(new CacheProfile { NoStore = true }));
        options.Filters.Add(new KnownExceptionsFilter());
      });

      services.AddNodeServices();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IOptions<Settings> settings)
    {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      app.UseStaticFiles();

      app.UseIdentity();

      if (settings.Value.EnableWindowsAuth)
      {
        app.Use(async (context, next) => {
          try
          {
            if (context.User.Identities.Count() == 2)
            {
              var identity = context.User.Identities.First(x => x is ClaimsIdentity);
              context.User = new ClaimsPrincipal(identity);
            }
            else
            {
              var signIn = context.RequestServices.GetRequiredService<SignInManager<AppUser>>();
              using (var db = new AppDbContext(1))
              {
                var user = db.Users.FirstOrDefault(u => u.UserName == context.User.Identity.Name);
                if (!string.IsNullOrEmpty(settings.Value.AutoCreateUserForDomain))
                {
                  if (user == null && context.User.Identity.Name.StartsWith(settings.Value.AutoCreateUserForDomain + "\\", StringComparison.OrdinalIgnoreCase))
                  {
                    user = CreateUser(db, context, settings);
                  }
                }
                if (user == null)
                {
                  context.Response.StatusCode = StatusCodes.Status403Forbidden;
                  return;
                }
                await signIn.SignInAsync(user, isPersistent: false);
                context.User = await signIn.CreateUserPrincipalAsync(user);
              }
            }
          }
          catch (Exception ex)
          {
            Loggers.Authentication.Error(ex, "Failed to auto-signin user");
            Loggers.Authentication.Info(ex.ToString());
          }
          await next();
        });
      }

      app.UseMvc(routes => {
        // All GET requests that do not match any previous routes are responded with our main html page.
        // This enables pushState navigation in IE11+ with deep linking.
        routes.MapSpaFallbackRoute("spa-fallback", new { controller = "Home", action = "Index" });
      });
    }

    private AppUser CreateUser(AppDbContext db, HttpContext context, IOptions<Settings> settings)
    {
      string nameWithoutDomain = context.User.Identity.Name.Split('\\').Last();
      var adInfo = ADHelper.FindAdInfo(settings.Value.LdapRootUrl, settings.Value.LdapUserName, settings.Value.LdapPassword, settings.Value.LdapUserRoot, nameWithoutDomain);
      var user = new AppUser {
        UserName = context.User.Identity.Name,
        FirstName = adInfo.AdsFirstName,
        LastName = adInfo.AdsLastName,
        Avatar = adInfo.Photo,
        RoleId = 5,
        SecurityStamp = "SecurityStamp"
      };
      db.Users.Add(user);
      db.SaveChanges();
      return user;
    }
  }
}