using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Infrastructure
{
  public static class ExceptionExtension
  {
    private static int GetSqlExceptionNumber(DbUpdateException ex)
    {
      var sqlEx = ex.GetBaseException() as SqlException;
      if (sqlEx != null)
      {
        if (sqlEx.Errors.Count > 0)
        {
          return sqlEx.Errors[0].Number;
        }
      }
      return -1;
    }

    public static bool IsUniqueConstraintViolation(this DbUpdateException ex)
    {
      return GetSqlExceptionNumber(ex) == 2601;
    }
  }
}
