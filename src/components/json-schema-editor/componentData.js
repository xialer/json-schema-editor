import Components from './components'

export var componentData = [
  new Components.SpliterComponent('---基础数据类型---'),
  new Components.ObjectComponent('对象'),
  new Components.StringComponent('字符'),
  new Components.IntegerComponent('整数'),
  new Components.NumberComponent('数字'),
  new Components.BooleanComponent('布尔'),
  new Components.ArrayComponent('数组'),
  new Components.NullComponent('空值'),
  new Components.SpliterComponent('---数据集合---'),
  new Components.PropertiesComponent('对象属性'),
  new Components.RequiredComponent('必填属性'),
  new Components.ItemsComponent('数组列表'), // List type of each item
  new Components.EnumComponent('枚举集合'), // List of valid values
  new Components.SpliterComponent('---扩展依赖---'),
  new Components.DependenciesComponent('依赖关系'), // List dependencies between properties
  new Components.DependencyItemComponent('依赖项'), // List of properties which specific property depend on
  new Components.SpliterComponent('---验证条件---'),
  new Components.AllOfComponent('全部满足'), // Data must be valid against all of the given subschemas
  new Components.AnyOfComponent('满足任意一个'), // Data must be valid against any of the given subschemas
  new Components.OneOfComponent('满足任意且一个'), // Data must be valid against exactly one of the given subschemas
  new Components.NotComponent('不能满足'), // Data must not be valid against all of the given subschemas
  new Components.RefComponent('外部索引') // Reference to external schema
]

export default componentData
