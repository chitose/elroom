using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using ELROOM.Web.Model;

namespace ELROOM.Web.Infrastructure
{
  public static class ADHelper
  {
    public const char AD_SEPARATOR = '\\';

    public const string ATTR_ADS_PATH = "adspath";
    public const string ATTR_DN = "distinguishedname";
    public const string ATTR_OBJECT_CATEGORY = "objectCategory";
    public const string ATTR_SAM_ACCOUNT_NAME = "sAMAccountName";
    public const string ATTR_LOGIN_NAME = "cn";
    public const string ATTR_MIDDLE_INITIAL_NAME = "initials";
    public const string ATTR_ADDRESS_NAME = "homePostalAddress";
    public const string ATTR_TITLE = "title";
    public const string ATTR_STATE = "state";

    public const string ATTR_FIRST_NAME = "givenName";
    public const string ATTR_LAST_NAME = "SN";
    public const string ATTR_EMAIL_ADDRESS = "mail";
    public const string ATTR_TELEPHONE_NUMBER = "telephoneNumber";
    public const string ATTR_HOME_PHONE_NUMBER = "homePhone";
    public const string ATTR_MODILE = "mobile";
    public const string ATTR_POSTAL_CODE = "postalCode";
    public const string ATTR_LOCATION = "l";
    public const string ATTR_STREET = "streetAddress";
    public const string ATTR_CANTON = "st";
    public const string ATTR_COUNTRY = "co";
    public const string ATTR_DEPARTMENT = "department";
    public const string ATTR_COMPANY = "company";
    public const string ATTR_ADOID = "objectSid";
    public const string ATTR_OBJECT_CLASSES = "objectClass";
    public const string ATTR_OBJECT_GROUP_CLASS = "group";
    public const string ATTR_MEMBERS = "member";
    public const string ATTR_USER = "user";

    private static string ConvertByteToStringSid(Byte[] sidBytes)
    {
      SecurityIdentifier sId = new SecurityIdentifier(sidBytes, 0);
      return sId.Value;
    }

    public static string[] GetProperty(SearchResult searchResult, string PropertyName)
    {
      List<string> properties = new List<string>();
      if (searchResult.Properties.Contains(PropertyName))
      {
        if (PropertyName != ATTR_ADOID)
        {
          foreach (var property in searchResult.Properties[PropertyName])
          {
            properties.Add(property.ToString());
          }
          return properties.ToArray();
        }
        else
        {
          return new string[] { ConvertByteToStringSid((Byte[])searchResult.Properties[PropertyName][0]) };
        }
      }
      else
      {
        return new string[] { null };
      }
    }

    public static DirectoryEntry CreateDirectoryEntry(string adConnection, string adUserName, string adPassword, string adRoot)
    {
      DirectoryEntry root;
      if (!string.IsNullOrEmpty(adUserName) && !string.IsNullOrEmpty(adPassword))
      {
        root = new DirectoryEntry(adConnection + "/" + adRoot, adUserName, adPassword, AuthenticationTypes.None);
      }
      else
      {
        root = new DirectoryEntry(adConnection + "/" + adRoot);
      }

      return root;
    }

    private static AdInfo CreateAdInfo(SearchResult result)
    {
      AdInfo adInfo = new AdInfo();

      adInfo.AdsSamAccountName = GetProperty(result, ATTR_SAM_ACCOUNT_NAME)[0];
      adInfo.AdsLoginName = GetProperty(result, ATTR_LOGIN_NAME)[0];
      adInfo.AdsInitialName = GetProperty(result, ATTR_MIDDLE_INITIAL_NAME)[0];

      adInfo.AdsFirstName = GetProperty(result, ATTR_FIRST_NAME)[0];
      adInfo.AdsLastName = GetProperty(result, ATTR_LAST_NAME)[0];
      adInfo.AdsEmail = GetProperty(result, ATTR_EMAIL_ADDRESS)[0];
      adInfo.AdsTelephoneNumber = GetProperty(result, ATTR_TELEPHONE_NUMBER)[0];
      adInfo.AdsHomeNumber = GetProperty(result, ATTR_HOME_PHONE_NUMBER)[0];
      adInfo.AdsMobileNumber = GetProperty(result, ATTR_MODILE)[0];
      using (var user = new DirectoryEntry(result.Path))
      {
        byte[] image = user.Properties["thumbnailPhoto"].Value as byte[];
        if (image != null)
        {
          adInfo.Photo = image;
        }
      }
      return adInfo;
    }

    public static AdInfo FindAdInfo(string adConnection, string adUserName, string adPassword, string adUserRoot, string samAccountName)
    {
      AdInfo adInfo = null;
      DirectoryEntry ldapConnection = CreateDirectoryEntry(adConnection, adUserName, adPassword, adUserRoot);
      DirectorySearcher search = new DirectorySearcher(ldapConnection);
      search.Filter = "(SAMAccountName=" + samAccountName + ")";
      SearchResult result = search.FindOne();
      if (result != null)
      {
        adInfo = CreateAdInfo(result);
      }
      return adInfo;
    }
  }
}