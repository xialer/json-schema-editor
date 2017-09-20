import Components from './components'

function setNodeValue (node, schema, propertyList) {
  propertyList.forEach(property => {
    if (schema[property]) node.value[property] = schema[property]
  })
}

function convertStringToTree (tree, schema) {
  let node = new Components.StringComponent('字符')
  setNodeValue(node, schema, ['minLength', 'maxLength', 'pattern', 'format'])
  if (schema.enum) convertEnumToTree(node, schema.enum)
  tree.children.push(node)
}

function convertIntegerToTree (tree, schema) {
  let node = new Components.IntegerComponent('整数')
  setNodeValue(node, schema, ['multipleOf', 'minimum', 'exclusiveMinimum', 'maximum', 'exclusiveMaximum'])
  if (schema.enum) convertEnumToTree(node, schema.enum)
  tree.children.push(node)
}

function convertNumberToTree (tree, schema) {
  let node = new Components.NumberComponent('数字')
  setNodeValue(node, schema, ['multipleOf', 'minimum', 'exclusiveMinimum', 'maximum', 'exclusiveMaximum'])
  if (schema.enum) convertEnumToTree(node, schema.enum)
  tree.children.push(node)
}

function convertBooleanToTree (tree, schema) {
  let node = new Components.BooleanComponent('布尔')
  tree.children.push(node)
}

function convertNullToTree (tree, schema) {
  let node = new Components.NullComponent('空值')
  tree.children.push(node)
}

function convertPropertiesToTree (tree, schema) {
  let node = new Components.PropertiesComponent('对象属性')
  Object.keys(schema).forEach(p => {
    convertSubSchemaToTree(node, schema[p])
    node.children[node.children.length - 1].name = p
    node.children[node.children.length - 1].editable = true
  })
  tree.children.push(node)
}

function convertRequiredToTree (tree, schema) {
  let node = new Components.RequiredComponent('必填属性')
  node.value = schema
  tree.children.push(node)
}

function convertDependencyItemToTree (tree, schema) {
  let node = new Components.DependencyItemComponent('依赖项')
  node.value = schema
  tree.children.push(node)
}

function convertDependenciesToTree (tree, schema) {
  let node = new Components.DependenciesComponent('依赖关系')
  Object.keys(schema).forEach(p => {
    convertDependencyItemToTree(node, schema[p])
    node.children[node.children.length - 1].name = p
  })
  tree.children.push(node)
}

function convertObjectToTree (tree, schema) {
  let node = new Components.ObjectComponent('对象')
  setNodeValue(node, schema, ['additionalProperties', 'minProperties', 'maxProperties'])
  if (schema.properties) convertPropertiesToTree(node, schema.properties)
  if (schema.required) convertRequiredToTree(node, schema.required)
  if (schema.dependencies) convertDependenciesToTree(node, schema.dependencies)
  if (schema.enum) convertEnumToTree(node, schema.enum)
  tree.children.push(node)
}

function convertItemsToTree (tree, schema) {
  if (Array.isArray(schema)) {
    let node = new Components.ItemsComponent('数组列表')
    schema.forEach(s => {
      convertSubSchemaToTree(node, s)
    })
    tree.children.push(node)
  } else {
    convertSubSchemaToTree(tree, schema)
    tree.children[tree.children.length - 1].name = 'items'
  }
}

function convertArrayToTree (tree, schema) {
  let node = new Components.ArrayComponent('数组')
  setNodeValue(node, schema, ['additionalItems', 'minItems', 'maxItems', 'uniqueItems'])
  if (schema.items) convertItemsToTree(node, schema.items)
  tree.children.push(node)
}

function convertEnumToTree (tree, schema) {
  let node = new Components.EnumComponent('枚举集合')
  node.value = schema
  tree.children.push(node)
}

function convertAllOfToTree (tree, schema) {
  let node = new Components.AllOfComponent('全部满足')
  schema.forEach(s => {
    convertSubSchemaToTree(node, s)
  })
  tree.children.push(node)
}

function convertAnyOfToTree (tree, schema) {
  let node = new Components.AnyOfComponent('满足任意')
  schema.forEach(s => {
    convertSubSchemaToTree(node, s)
  })
  tree.children.push(node)
}

function convertOneOfToTree (tree, schema) {
  let node = new Components.OneOfComponent('满足任意且一个')
  schema.forEach(s => {
    convertSubSchemaToTree(node, s)
  })
  tree.children.push(node)
}

function convertNotToTree (tree, schema) {
  let node = new Components.NotComponent('不能满足')
  schema.forEach(s => {
    convertSubSchemaToTree(node, s)
  })
  tree.children.push(node)
}

function convertRefToTree (tree, schema) {
  let node = new Components.RefComponent('外部索引')
  node.value['$ref'] = schema
  tree.children.push(node)
}

function convertSubSchemaToTree (tree, schema) {
  if (schema.type) {
    switch (schema.type) {
      case 'string':
        return convertStringToTree(tree, schema)
      case 'integer':
        return convertIntegerToTree(tree, schema)
      case 'number':
        return convertNumberToTree(tree, schema)
      case 'boolean':
        return convertBooleanToTree(tree, schema)
      case 'null':
        return convertNullToTree(tree, schema)
      case 'object':
        return convertObjectToTree(tree, schema)
      case 'array':
        return convertArrayToTree(tree, schema)
    }
  }
  if (schema.enum) return convertEnumToTree(tree, schema.enum)
  if (schema.allOf) return convertAllOfToTree(tree, schema.allOf)
  if (schema.anyOf) return convertAnyOfToTree(tree, schema.anyOf)
  if (schema.oneOf) return convertOneOfToTree(tree, schema.oneOf)
  if (schema.not) return convertNotToTree(tree, schema.not)
  if (schema['$ref']) return convertRefToTree(tree, schema['$ref'])
}

export function convertSchemaToTree (schema, name) {
  let tree = new Components.JsonSchemaComponent('结构定义')
  tree.name = schema.title || name
  tree.tooltip = schema.description
  tree.value.description = schema.description
  convertSubSchemaToTree(tree, schema)
  return tree
}

export default convertSchemaToTree
