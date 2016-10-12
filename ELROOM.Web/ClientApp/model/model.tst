${
  using System.Collections;
  using System.Text;
  using IO = System.IO;
  using Typewriter.Extensions.Types;

  Template(Settings settings)
  {
    settings.OutputFilenameFactory = file => CamelCase(IO.Path.GetFileNameWithoutExtension(file.Name));
  }

  static string CamelCase(string s)
  {
      if (string.IsNullOrEmpty(s)) return s;
      if (char.IsUpper(s[0]) == false) return s;
      var chars = s.ToCharArray();
      chars[0] = char.ToLowerInvariant(chars[0]);
      return new string(chars);
  }

  IEnumerable<Property> InheritedProperties(Class @class)
  {
    while (@class != null)
    {
      foreach (var p in @class.Properties)
        if (p.HasSetter && !p.Attributes.Any(a=>a.Name == "JsonIgnore" || a.Name == "OptionalModel" || a.name=="DatabaseGenerated"))
            yield return p;
      @class = @class.BaseClass;
    }
  }

  IEnumerable<Property> AllProperties(Class @class)
  {
    while (@class != null)
    {
      foreach (var p in @class.Properties)
            yield return p;
      @class = @class.BaseClass;
    }
  }

  IEnumerable<Property> OptionalInheritedProperties(Class @class){
      while (@class != null)
        {
          foreach (var p in @class.Properties)
            if (!p.HasSetter || p.Attributes.Any(a=>a.Name == "JsonIgnore" || a.Name == "OptionalModel" || a.name=="DatabaseGenerated"))
                yield return p;
          @class = @class.BaseClass;
        }
  }

  private bool Visited(Type type, Dictionary<string, Type> set)
  {
    if (type.IsDefined && !set.ContainsKey(type.FullName))
    {
      set.Add(type.FullName, type);
      return true;
    }
    return false;
  }

  private void VisitTypes(Class @class, Dictionary<string, Type> set)
  {
    foreach (var p in AllProperties(@class))
    {
      var t = p.Type.Unwrap();
      Visited(t, set);
    }
  }

  static Dictionary<File, IEnumerable<Type>> DependenciesCache = new Dictionary<File, IEnumerable<Type>>();

  IEnumerable<Type> Dependencies(File file)
  {
    IEnumerable<Type> result;
    if (DependenciesCache.TryGetValue(file, out result)) return result;

    var set = new Dictionary<string, Type>();
    foreach (var @class in file.Classes)
      VisitTypes(@class, set);
    result = set.Values;

    DependenciesCache.Add(file, result);
    return result;
  }
  
  bool HasEnumDependencies(File file) => Dependencies(file).Any(x => x.IsEnum);
  IEnumerable<Type> EnumDependencies(File file) => Dependencies(file).Where(t => t.IsEnum);
  IEnumerable<Type> ClassDependencies(File file) => Dependencies(file).Where(t => !t.IsEnum);
}
// This file is auto-generated, don't modify it manually or your changes will be lost.
$HasEnumDependencies[import { $EnumDependencies[$Name][, ] } from './enums';]
$ClassDependencies[import { $Name } from './$name';
]
$Classes(ELROOM.Web.Model.*)[
export interface $Name {
$InheritedProperties[  $name: $Type;
]$OptionalInheritedProperties[$name?: $Type;
]}]
$Enums(ELROOM.Web.Model.*)[
export enum $Name {
$Values[  $Name = $Value][,
]
}
]