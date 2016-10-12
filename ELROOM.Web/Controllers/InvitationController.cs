using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using ELROOM.Web.Infrastructure;
using ELROOM.Web.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ELROOM.Web.Controllers {
    [Route("api/[controller]")]
    public class InvitationController : ApiController {
        public InvitationController(AppDbContext db, IOptions<Settings> settings) : base(db, settings) {
        }

        [HttpGet("getInvitationsForCurrentUser")]
        public IEnumerable<Invitations> GetInvitationsForCurrentUser() {
            var userId = User.GetId();           
            var invitations = db.Invitations.Include(i => i.Group).Where(i => i.UserId == userId).OrderBy(x => x.CreationDate).Take(5);
            return invitations;     
        }

        [HttpGet("acceptInvitation")]
        public IEnumerable<Invitations> AcceptInvitation(int id) {
            var userId = User.GetId();
            var dbInvitation = db.Invitations.FirstOrDefault(i => i.Id == id);          
            if (dbInvitation != null) {
                db.UserGroups.Add(new UserGroup { UserId = userId, GroupId = dbInvitation.GroupId });
                db.Invitations.Remove(dbInvitation);
                db.SaveChanges();
                return GetInvitationsForCurrentUser();
            } else {
                throw new BusinessException("common:message.invitation_not_found");
            }
        }

        [HttpGet("rejectInvitation")]
        public IEnumerable<Invitations> RejectInvitation(int id) {
            var userId = User.GetId();
            var dbInvitation = db.Invitations.FirstOrDefault(i => i.Id == id);
            if (dbInvitation != null) {                
                db.Invitations.Remove(dbInvitation);
                db.SaveChanges();
                return GetInvitationsForCurrentUser();
            } else {
                throw new BusinessException("common:message.invitation_not_found");
            }
        }
    }
}
