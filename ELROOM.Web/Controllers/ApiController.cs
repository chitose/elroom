using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ELROOM.Web.Configuration;
using ELROOM.Web.Data;
using ELROOM.Web.Model;
using System.Text.RegularExpressions;

namespace ELROOM.Web.Controllers
{
  public class ApiController : Controller
  {
    protected readonly AppDbContext db;
    protected readonly IOptions<Settings> settings;

    public ApiController(AppDbContext db, IOptions<Settings> settings)
    {
      this.db = db;
      this.settings = settings;
    }

    protected byte[] GetImageFromClient(string dataUrl, int entityId)
    {
      if (!string.IsNullOrEmpty(dataUrl) && dataUrl != entityId.ToString())
      {
        var base64Data = Regex.Match(dataUrl, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
        return Convert.FromBase64String(base64Data);
      }
      return null;
    }
  }
}