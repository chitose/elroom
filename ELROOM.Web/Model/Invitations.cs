using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
    public class Invitations : BaseEntity {
        public int UserId { get; set; }
        public int GroupId { get; set; }

        [JsonIgnore]
        public virtual AppUser User { get; set; }
        [JsonIgnore]
        public virtual Group Group { get; set; }

        public string GroupName
        {
            get
            {
                return Group != null ? Group.Name : string.Empty;
            }
        }

        public byte[] GroupRowVersion {
            get {
                return Group != null ? Group.RowVersion : new byte[0];
            }
        }
    }    
}
