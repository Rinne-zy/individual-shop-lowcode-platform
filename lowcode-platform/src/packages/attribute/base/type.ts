/** 输入框、单选框等比较简单的输入框配置 */
export interface BaseControlOption {
  label: string,
  type: string,
}

export interface SelectControlOption extends BaseControlOption {
  options: {
    value: string,
    label: string,
  }[],
}

export enum ControlType {
  Text = 'text',
  Number = 'number',
  Color = 'color',
  Radio = 'radio',
  Switch = 'switch',
  Select = 'select',
}