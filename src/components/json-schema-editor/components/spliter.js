export class StringComponent {
  constructor (tooltip) {
    this.type = 'spliter'
    this.tooltip = tooltip
    this.icon = undefined
    this.value = undefined
    this.valueSchema = undefined
    this.children = []
    this.editable = false
    this.funcs = undefined
  }
}

export default StringComponent
