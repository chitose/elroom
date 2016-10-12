using System.Collections.Generic;

namespace ELROOM.Web.Model
{
  public interface BasePagingSearchResponse<T>
  {
    long TotalRecords { get; set; }
    IEnumerable<T> Data { get; set; }
  }
}