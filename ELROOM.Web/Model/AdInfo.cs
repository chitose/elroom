using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELROOM.Web.Model
{
  public class AdInfo
  {

    public string AdsDistinguishedname {
      get;
      set;
    }

    public string AdsSamAccountName {
      get;
      set;
    }

    public string AdsLoginName {
      get;
      set;
    }

    public string AdsFirstName {
      get;
      set;
    }

    public string AdsInitialName {
      get;
      set;
    }

    public string AdsLastName {
      get;
      set;
    }

    public string AdsTelephoneNumber {
      get;
      set;
    }

    public string AdsEmail {
      get;
      set;
    }

    public string AdsHomeNumber {
      get;
      set;
    }

    public string AdsMobileNumber {
      get;
      set;
    }    

    public byte[] Photo { get; set; }
  }
}
