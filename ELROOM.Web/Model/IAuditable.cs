using System;

namespace ELROOM.Web.Model
{
  public interface IAuditable
  {
    DateTime CreationDate { get; set; }
    DateTime ModificationDate { get; set; }
  }
}