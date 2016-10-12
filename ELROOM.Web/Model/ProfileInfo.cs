using System.Collections.Generic;

namespace ELROOM.Web.Model
{
    public class ProfileInfo
    {
        public int? Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Options { get; set; }
        public string Avatar { get; set; }
        public string DisplayName {
            get { return $"{LastName} {FirstName}"; }
        }
        public IList<int> PrivateGroups { get; set; }
        public IList<int> Groups { get; set; }

        public byte[] RowVersion { get; set; }
    }
}