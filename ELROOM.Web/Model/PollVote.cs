using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model
{
  public class PollVote : BaseEntity, IOwnable
  {
    public int PollId { get; set; }
    public int OwnerId { get; set; }
  }
}
