using System;
using System.ComponentModel.DataAnnotations;

namespace ELROOM.Web.Data.Validation
{
  public class DateAfter : ValidationAttribute
  {
    private readonly string m_otherProperty;

    public DateAfter(string otherProperty) : base("{0} Must be after {1}")
    {
      m_otherProperty = otherProperty;
    }

    public override string FormatErrorMessage(string name)
      => string.Format(ErrorMessageString, name, m_otherProperty);

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
      return IsDateBefore(value, GetOther(validationContext)) ? new ValidationResult(FormatErrorMessage(validationContext.DisplayName)) : ValidationResult.Success;
    }

    private static bool IsDateBefore(object date1, object date2)
    {
      return date1 != null && date2 != null
             && date1 is DateTime && date2 is DateTime
             && (date1 as DateTime?).Value.Date < (date2 as DateTime?).Value.Date;
    }

    private object GetOther(ValidationContext context)
    {
      return context.ObjectType
                    .GetProperty(m_otherProperty)
                    .GetValue(context.ObjectInstance);
    }
  }
}