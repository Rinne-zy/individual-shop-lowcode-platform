import type { CascaderPanelOption } from "../models/type";

/**
 * 获取分类标签名
 * @param options 分类级联对象 
 * @returns 
 */
export function getTypeLabels(options: CascaderPanelOption[]) {
  let labelsByValue: Record<string, string> = {};
  options.forEach((option) =>  {
    labelsByValue[option.value] = option.label;
    labelsByValue = {
      ...labelsByValue,
      ...getTypeLabels(option.children)
    }
  })

  return labelsByValue;
}