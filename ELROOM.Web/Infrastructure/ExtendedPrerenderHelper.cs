using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Newtonsoft.Json;

namespace ELROOM.Web.Infrastructure
{
  [HtmlTargetElement(Attributes = PrerenderModuleAttributeName)]
  public class ExtendedPrerenderHelper : PrerenderTagHelper
  {
    private const string PrerenderModuleAttributeName = "asp-prerender-module";
    private const string PrerenderExportAttributeName = "asp-prerender-export";
    private const string PrerenderWebpackConfigAttributeName = "asp-prerender-webpack-config";
    private const string PrerenderDataAttributeName = "asp-prerender-data";
    private const string PrerenderTimeoutAttributeName = "asp-prerender-timeout";

    private readonly IServiceProvider serviceProvider;
    private readonly string _applicationBasePath;
    private readonly INodeServices _nodeServices;

    public ExtendedPrerenderHelper(IServiceProvider serviceProvider) : base(serviceProvider)
    {
      this.serviceProvider = serviceProvider;
      var hostEnv = (IHostingEnvironment)serviceProvider.GetService(typeof(IHostingEnvironment));
      _nodeServices = (INodeServices)serviceProvider.GetService(typeof(INodeServices));
      _applicationBasePath = hostEnv.ContentRootPath;
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
      var requestFeature = ViewContext.HttpContext.Features.Get<IHttpRequestFeature>();
      var unencodedPathAndQuery = requestFeature.RawTarget;

      var request = ViewContext.HttpContext.Request;
      var unencodedAbsoluteUrl = $"{request.Scheme}://{request.Host}{unencodedPathAndQuery}";

      var result = await Prerenderer.RenderToString(
          _applicationBasePath,
          _nodeServices,
          new JavaScriptModuleExport(ModuleName) {
            ExportName = ExportName,
            WebpackConfig = WebpackConfigPath
          },
          unencodedAbsoluteUrl,
          unencodedPathAndQuery,
          CustomDataParameter,
          TimeoutMillisecondsParameter);

      if (!string.IsNullOrEmpty(result.RedirectUrl))
      {
        // It's a redirection
        ViewContext.HttpContext.Response.Redirect(result.RedirectUrl);
        return;
      }

      // It's some HTML to inject
      ViewContext.HttpContext.Items["Server-Render-Html"] = result.Html;

      // Also attach any specified globals to the 'window' object. This is useful for transferring
      // general state between server and client.
      if (result.Globals != null)
      {
        var stringBuilder = new StringBuilder();
        foreach (var property in result.Globals.Properties())
        {
          if ("documentTitle".Equals(property.Name))
          {
            ViewContext.ViewData["Title"] = property.Value.ToString().TrimStart('"').TrimEnd('"');
          }
          stringBuilder.AppendFormat("window.{0} = {1};",
              property.Name,
              property.Value.ToString(Formatting.None));
        }
        output.PostElement.SetHtmlContent($"<script>{stringBuilder}</script>");
      }
    }
  }

  [HtmlTargetElement(Attributes = RenderOutputAttributeName)]
  public class ServerRenderOutput : TagHelper
  {
    private const string RenderOutputAttributeName = "asp-prerender-output";

    [HtmlAttributeNotBound]
    [ViewContext]
    public ViewContext ViewContext { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
      output.Content.SetHtmlContent(ViewContext.HttpContext.Items["Server-Render-Html"] as string);
    }
  }
}