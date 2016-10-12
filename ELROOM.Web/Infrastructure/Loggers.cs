using NLog;

namespace ELROOM.Web.Infrastructure
{
  public static class Loggers
  {
    public static readonly Logger Authentication;
    public static readonly Logger Default;
    public static readonly Logger Sql;

    static Loggers()
    {
      Authentication = LogManager.GetLogger("AUTH");
      Default = LogManager.GetLogger("ELROOM");
      Sql = LogManager.GetLogger("SQL");
    }
  }
}