/** 输入框、单选框等比较简单的输入框配置 */
export interface BaseControlOption {
  label: string,
  type: string,
  options?: Record<string, string | number | boolean>
}

export interface SelectControlOption {
  label: string,
  type: string,
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
  Slider = 'slider',
}