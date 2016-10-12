using System;
using System.Data.Entity;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using ELROOM.Web.Infrastructure;
using ELROOM.Web.Model;

namespace ELROOM.Web.Controllers {
    [Route("api/[controller]")]
    public class AuthController : ApiController {
        public AuthController(AppDbContext db, IOptions<Settings> settings) : base(db, settings) {
        }

        [HttpPost("updateProfile")]
        public async Task<ProfileInfo> UpdateProfile([FromBody]ProfileInfo request) {
            var userId = User.GetId();
            var user = db.Users.FirstOrDefault(u => u.Id == userId);
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Avatar = GetImageFromClient(request.Avatar, userId);
            user.Options = request.Options;
            await db.SaveChangesAsync();
            request.RowVersion = user.RowVersion;
            request.Id = userId;
            return request;
        }

        [HttpGet("getAvatar{id}")]
        public FileResult GetAvatar(int id) {
            var user = db.Users.FirstOrDefault(u => u.Id == id);
            return PhotoHelper.GetPhotoResponse(PhotoHelper.GetPhotoThumb(user.Avatar, 40));
        }

        [HttpGet("getFullImage{id}")]
        public FileResult GetFullImage(int id) {
            var user = db.Users.FirstOrDefault(u => u.Id == id);
            return PhotoHelper.GetPhotoResponse(user.Avatar);
        }
    }
}