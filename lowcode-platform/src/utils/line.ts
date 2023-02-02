import { ADSORPTION_DIFF } from "lowcode-platform/const";
import type { CommonStyleSchema } from "lowcode-platform/packages/types";
import type { getComponentRotatedStyle } from "./rotate";

/** 辅助线状态 */
export interface LineCondition {
  isNearly: boolean,
  line: AuxiliaryLineType,
  adsorptionPos: number,
  linePos: number,
}

/** 辅助线类型 */
export enum AuxiliaryLineType {
  xTop = 'xt',
  xCenter = 'xc',
  xBottom = 'xb',
  yLeft = 'yl',
  yCenter = 'yc',
  yRight = 'yr',
}

/** 用于辅助线计算的组件样式 */
type ComponentStyleForLine = ReturnType<typeof getComponentRotatedStyle>;

function isNearly(d1: number, d2: number, diff: number) {
  return Math.abs(d1 - d2) <= diff;
}

/**
 * 判断两个组件 x 轴三条辅助线是否能相交
 * @param curComponentStyle 拖动组件样式
 * @param componentStyle 目标组件样式
 * @returns 两个组件 x 轴三条辅助线是否能相交
 */
function isHorizontalLineTroughComponent(curComponentStyle: ComponentStyleForLine, componentStyle: ComponentStyleForLine) {
  return !(curComponentStyle.bottom < componentStyle.top || curComponentStyle.top > componentStyle.bottom)
}

/**
 * 获取两个组件 x 轴三条辅助线相交情况
 * @param curComponentStyle 拖动组件样式
 * @param componentStyle 目标组件样式
 * @returns 两个组件 x 轴三条辅助线相交情况
 */
export function getHorizontalLineConditions(
  curComponentStyle: ComponentStyleForLine,
  componentStyle: ComponentStyleForLine,
) {
  // 不相交情况
  if(!isHorizontalLineTroughComponent(curComponentStyle, componentStyle)) {
    return [];
  }

  return [
    // 顶贴顶
    {
      isNearly: isNearly(curComponentStyle.top, componentStyle.top, ADSORPTION_DIFF),
      line: AuxiliaryLineType.xTop,
      adsorptionPos: componentStyle.top,
      linePos: componentStyle.top,
    },
    // 底贴顶
    {
      isNearly: isNearly(curComponentStyle.bottom, componentStyle.top, ADSORPTION_DIFF),
      line: AuxiliaryLineType.xTop,
      adsorptionPos: componentStyle.top - curComponentStyle.height,
      linePos: componentStyle.top,
    },
    // 中线贴中线
    {
      isNearly: isNearly(curComponentStyle.top + curComponentStyle.halfHeight, componentStyle.top + componentStyle.halfHeight, ADSORPTION_DIFF),
      line: AuxiliaryLineType.xCenter,
      adsorptionPos: componentStyle.top + componentStyle.halfHeight - curComponentStyle.halfHeight,
      linePos: componentStyle.top + componentStyle.halfHeight,
    },
    // 顶贴底
    {
      isNearly: isNearly(curComponentStyle.top, componentStyle.bottom, ADSORPTION_DIFF),
      line: AuxiliaryLineType.xBottom,
      adsorptionPos: componentStyle.bottom,
      linePos: componentStyle.bottom,
    },
    // 底贴底
    {
      isNearly: isNearly(curComponentStyle.bottom, componentStyle.bottom, ADSORPTION_DIFF),
      line: AuxiliaryLineType.xBottom,
      adsorptionPos: componentStyle.bottom - curComponentStyle.height,
      linePos: componentStyle.bottom,
    },
  ]
}

/**
 * 判断两个组件 y 轴三条辅助线是否能相交
 * @param curComponentStyle 拖动组件样式
 * @param componentStyle 目标组件样式
 * @returns 两个组件 y 轴三条辅助线是否能相交
 */
function isVerticalLineTroughComponent(curComponentStyle: ComponentStyleForLine, componentStyle: ComponentStyleForLine) {
  return !(curComponentStyle.right < componentStyle.left || curComponentStyle.left > componentStyle.right)
}

/**
 * 获取两个组件 y 轴三条辅助线相交情况
 * @param curComponentStyle 拖动组件样式
 * @param componentStyle 目标组件样式
 * @returns 两个组件 y 轴三条辅助线相交情况
 */
export function getVerticalLineConditions(
  curComponentStyle: ComponentStyleForLine,
  componentStyle: ComponentStyleForLine,
) {
  // 不相交情况进行剪枝
  if(!isVerticalLineTroughComponent(curComponentStyle, componentStyle)) {
    return [];
  }

  return [
    // 左贴左
    {
      isNearly: isNearly(curComponentStyle.left, componentStyle.left, ADSORPTION_DIFF),
      line: AuxiliaryLineType.yLeft,
      adsorptionPos: componentStyle.left,
      linePos: componentStyle.left,
    },
    // 右贴左
    {
      isNearly: isNearly(curComponentStyle.right, componentStyle.left, ADSORPTION_DIFF),
      line: AuxiliaryLineType.yLeft,
      adsorptionPos: componentStyle.left - curComponentStyle.width,
      linePos: componentStyle.left,
    },
    // 中线贴中线
    {
      isNearly: isNearly(curComponentStyle.left + curComponentStyle.halfWidth, componentStyle.left + componentStyle.halfWidth, ADSORPTION_DIFF),
      line: AuxiliaryLineType.yCenter,
      adsorptionPos: componentStyle.left + componentStyle.halfWidth - curComponentStyle.halfWidth,
      linePos: componentStyle.left + componentStyle.halfWidth,
    },
    // 左贴右
    {
      isNearly: isNearly(curComponentStyle.left, componentStyle.right, ADSORPTION_DIFF),
      line: AuxiliaryLineType.yRight,
      adsorptionPos: componentStyle.right,
      linePos: componentStyle.right,
    },
    // 右贴右
    {
      isNearly: isNearly(curComponentStyle.right, componentStyle.right, ADSORPTION_DIFF),
      line: AuxiliaryLineType.yRight,
      adsorptionPos: componentStyle.right - curComponentStyle.width,
      linePos: componentStyle.right,
    },
  ]
}

/**
 * 获取吸附辅助线后的位置
 * @param key 吸附辅助线的类型
 * @param adsorptionPos 吸附位置
 * @param curStyle 当前组件样式
 * @param rotatedStyle 旋转后的样式
 * @returns 吸附辅助线后的位置
 */
export function getAdsorptionLinePosStyle(key: string, adsorptionPos: number, curStyle: CommonStyleSchema, rotatedStyle: ComponentStyleForLine) {
  if(key === 'left') {
    return {
      left: curStyle.rotate !== 0 
        ? Math.round(adsorptionPos - (curStyle.width - rotatedStyle.width) / 2)
        : adsorptionPos,
    }
  }
  
  return {
    top: curStyle.rotate !== 0 
      ? Math.round(adsorptionPos - (curStyle.height - rotatedStyle.height) / 2)
      : adsorptionPos,
  }
}