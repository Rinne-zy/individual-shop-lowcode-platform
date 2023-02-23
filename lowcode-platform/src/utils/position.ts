import { transformPxToNumber } from "./unit";

/**
 * 计算位置偏移，若小于 0 则返回 0
 * @param pos 位置
 * @param offset 偏移
 * @returns 最终位置
 */
export function calcPositionOffset(pos: number | string, offset: number | string) {
  const position = transformPxToNumber(pos) - transformPxToNumber(offset);
  return position >= 0 ? position : 0;
}

/**
 * 判断当前位置最右侧是否超过画布的最右侧
 * @param pos 左上角位置
 * @param width 左上角距离右上角宽度 
 * @param canvasWidth 画布宽度
 * @returns 当前位置最右侧是否超过画布的最右侧
 */
export function isPositionOutOfCanvasRight(pos: number | string, width: string | number, canvasWidth: number | string) { 
  if (typeof width === 'number') {
    return transformPxToNumber(pos) + width > transformPxToNumber(canvasWidth);
  }

  const cw = transformPxToNumber(canvasWidth);
  const w = width.includes('%') ? transformPxToNumber(width.split('%')[0]) * 0.01 * cw : transformPxToNumber(width); 

  return transformPxToNumber(pos) + w > cw
}