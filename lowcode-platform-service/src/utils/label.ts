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

/**
 * 获取最后一层的类型
 * @param options 选项
 * @param labelsByValue 标签
 * @returns 
 */
export function getLastLayerTypeLabels(options: CascaderPanelOption[], labelsByValue: { label: string, value: string }[] = []) {
  options.forEach((option) => {
    if(!option || !option.children) return;
    // 存在子分类
    if(option.children.length !== 0) {
      getLastLayerTypeLabels(option.children, labelsByValue);
      return;
    }

    const { value, label } = option;
    labelsByValue.push({
      value,
      label,
    })
  })

  return labelsByValue
}

/**
 * 获取所有分类 id 对应的标签名
 * @param options 分类选项
 * @param labelByType 标签id对应的标签名
 * @returns 
 */
export function getLabelsByType(options: CascaderPanelOption[], labelByType: Record<string, string> = {}) {
  options.forEach((option) => {
    if(!option) return;
    labelByType[option.value] = option.label;
    getLabelsByType(option.children, labelByType);
  })

  return labelByType
}