using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ELROOM.Web.Controllers
{
    [Route("api/[controller]")]
    public class StickersController : ApiController
    {
        public StickersController(AppDbContext db, IOptions<Settings> settings) : base(db, settings)
        {
        }

        [HttpGet("getAllStickers")]
        public Dictionary<string, List<string>> GetAllStickers()
        {
            var directoryInfo = new DirectoryInfo(@"wwwroot/stickers");
            var res = new Dictionary<string, List<string>>();
            var supportExts = new[] { ".png", ".gif", ".jpg" };
            if (directoryInfo.Exists)
            {
                foreach (var dir in directoryInfo.GetDirectories())
                {
                    var collection = new List<string>();
                    res.Add(dir.Name, collection);
                    var files = dir.GetFiles("*.*").Where(s => supportExts.Any(e => s.Name.EndsWith(e, StringComparison.OrdinalIgnoreCase)));
                    foreach (var file in files)
                    {
                        collection.Add($"{directoryInfo.Name}/{dir.Name}/{file.Name}");
                    }
                }
            }
            return res;
        }
    }
}
