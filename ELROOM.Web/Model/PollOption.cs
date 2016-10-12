using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ELROOM.Web.Model
{
  public class PollOption : BaseEntity
  {
    public string Content { get; set; }
    public int PostId { get; set; }

    [JsonIgnore]
    [ForeignKey(nameof(PostId))]
    public Post Post { get; set; }

    public PollOption()
    {
      PollVotes = new HashSet<PollVote>();
    }

    public virtual ICollection<PollVote> PollVotes { get; set; }
  }
}
