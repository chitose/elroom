using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace ELROOM.Web
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var url = args.Length == 1 ? args[0] : string.Empty;
      var host = new WebHostBuilder()
          .UseKestrel()
          .UseContentRoot(Directory.GetCurrentDirectory())
          .UseIISIntegration()
          .UseStartup<Startup>();
      if (!string.IsNullOrEmpty(url))
      {
        host.UseUrls(url);
      }

      host.Build().Run();
    }
  }
}