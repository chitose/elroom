using System.Data.Entity.ModelConfiguration.Conventions;

namespace ELROOM.Web.Data
{
  public class RowVersionConvention : Convention
  {
    public RowVersionConvention()
    {
      Properties<byte[]>()
        .Where(p => p.Name == "RowVersion")
        .Configure(c => c.IsRowVersion());
    }
  }
}