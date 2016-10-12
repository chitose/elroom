using System;
using System.Data.Entity.Infrastructure;
using System.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ELROOM.Web.Infrastructure
{
  public class KnownExceptionsFilter : ExceptionFilterAttribute
  {
    public override void OnException(ExceptionContext context)
    {
      var ex = context.Exception;
      var request = context.HttpContext.Request;

      if (ExceptionToHttpResult(ex, context))
        Loggers.Default.Warn(ex);
      else
        Loggers.Default.Error(ex);
    }

    private bool ExceptionToHttpResult(Exception ex, ExceptionContext context)
    {
      if (ex is DbUpdateConcurrencyException)
      {
        context.Result = new StatusCodeResult(StatusCodes.Status412PreconditionFailed);
        return true;
      }

      if (ex is BusinessException)
      {
        context.Result = new ObjectResult(new { ex.Message, (ex as BusinessException).Infos, BusinessException = true }) { StatusCode = StatusCodes.Status406NotAcceptable };
        return true;
      }

      if (ex is SecurityException)
      {
        context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
        return true;
      }

      return false;
    }
  }

  public class BusinessException : Exception
  {
    public object Infos { get; set; }

    public BusinessException(string message) : base(message)
    { }
  }
}