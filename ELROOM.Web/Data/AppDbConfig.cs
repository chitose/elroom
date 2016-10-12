using System.Data.Entity;
using System.Data.Entity.SqlServer;

namespace ELROOM.Web.Data
{
  public class AppDbConfig : DbConfiguration
  {
    public static string ConnectionString;

    public AppDbConfig()
    {
      SetDatabaseInitializer<AppDbContext>(null);
      SetProviderServices("System.Data.SqlClient", SqlProviderServices.Instance);
    }
  }
}