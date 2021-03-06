﻿using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;

namespace ELROOM.Web.Configuration
{
  public static class ConfigurationExtensions
  {
    public static IConfigurationBuilder AddEnvironmentConfig(this IConfigurationBuilder config, string filename, string basePath)
    {
      // We want to be able to read config one level higher than the deployed package
      // Note that for security reasons, PhysicalFileProvider does not accept relative paths that
      // navigates out of the root path, such as '..\envsettings.json'
      config.AddJsonFile(provider: new PhysicalFileProvider(Path.Combine(basePath, "..")),
                         path: filename,
                         optional: true,
                         reloadOnChange: true);
      return config;
    }
  }
}