using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using System.Data.Entity;
using ELROOM.Web.Infrastructure;
using ELROOM.Web.Model;

namespace ELROOM.Web.Controllers
{
    public class HomeController : Controller
    {
        private static readonly string cacheDate = GetCacheDate();
        private readonly Settings settings;
        private readonly AppDbContext db;
        private readonly IHostingEnvironment env;

        public HomeController(IOptions<Settings> settings, AppDbContext db, IHostingEnvironment env)
        {
            this.settings = settings.Value;
            this.env = env;
            this.db = db;
        }

        [AddHeader("X-Frame-Options", "deny")]
        [AddHeader("X-XSS-Protection", "1; mode=block")]
        public IActionResult Index()
        {
            ProfileInfo profile = null;
            if (User.Identity.IsAuthenticated)
            {
                var userId = User.GetId();
                var user = db.Users.Include(x => x.UserGroups).FirstOrDefault(u => u.Id == userId);
                if (user != null)
                    profile = new ProfileInfo {
                        UserName = user.UserName,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Avatar = user.Avatar != null ? user.Id.ToString() : "",
                        Options = user.Options,
                        RowVersion = user.RowVersion,
                        Id = user.Id,
                        PrivateGroups = db.Groups.Where(g => g.Private).Select(x => x.Id).ToList(),
                        Groups = user.UserGroups.Select(x => x.GroupId).ToList()
                    };
            }

            var languages = Request.Headers["Accept-Language"].FirstOrDefault();
            if (!string.IsNullOrEmpty(languages))
            {
                languages = languages.Split(',').First();
            }

            return View(new Model {
                CacheDate = cacheDate,
                Language = languages,
                Settings = settings,
                UserAgent = Request.Headers["User-Agent"],
                I18Resources = GetJsonResource(),
                UserProfile = profile
            });
        }

        private object GetJsonResource()
        {
            DirectoryInfo dir = new DirectoryInfo(Path.Combine(env.WebRootPath, "locales"));
            var res = new Dictionary<string, Dictionary<string, object>>();
            if (dir.Exists)
            {
                foreach (var s in dir.GetDirectories())
                {
                    var lang = new Dictionary<string, object>();
                    res.Add(s.Name, lang);
                    var jsonFiles = s.GetFiles("*.json");
                    foreach (var json in jsonFiles)
                    {
                        using (var st = new StreamReader(json.FullName))
                        {
                            var jsonData = JsonConvert.DeserializeObject<object>(st.ReadToEnd());
                            lang.Add(Path.GetFileNameWithoutExtension(json.Name), jsonData);
                        }
                    }
                }
            }
            return res;
        }

        private static string GetCacheDate()
        {
            string assemblyFile = typeof(HomeController).Assembly.Location;
            return new FileInfo(assemblyFile).LastWriteTime.ToString("yyyy-MM-dd@HH:mm:ss", CultureInfo.InvariantCulture);
        }

        public class Model
        {
            public string CacheDate { get; set; }
            public Settings Settings { get; set; }
            public string Language { get; set; }
            public string UserAgent { get; set; }
            public object I18Resources { get; set; }
            public ProfileInfo UserProfile { get; set; }
        }
    }
}