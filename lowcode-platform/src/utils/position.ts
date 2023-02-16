import { transformPxToNumber, getWidthPxNumber, getHeightPxNumber } from "./unit";

/** 坐标点 */
export interface Point  {
  x: number,
  y: number,
}

/**
 * 计算样式的中心点位置（绝对定位）
 * @param style 样式 注意宽高需要先转成 px 数值
 * @param scrollTop 父元素滚动条高度
 * @returns 样式中心点
 */
export function getStyleCenterPosition(style: CSSStyleDeclaration, scrollTop = 0) {
  const left = transformPxToNumber(style.left);
  // 由于计算是基于屏幕坐标，因此需要根据父元素滚动条距离修正 top 值
  const top = transformPxToNumber(style.top) - scrollTop;
  const width = getWidthPxNumber(style.width);
  const height = getHeightPxNumber(style.height);

  return {
    x: left + width / 2,
    y: top + height / 2,
  }
}

/**
 * 计算两个点的中心点的位置
 * @param p1 点
 * @param p2 点
 * @returns 中心点位置坐标
 */
export function getCenterPosition(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  }
}

/**
 * 过点point 做垂线交AB于点C，返回点C
 * @param point
 * @param A
 * @param B
 * @returns
 */
export function calcPointInLine (point: Point, A: Point, B: Point) {
  // 计算点到某条直线上的垂直点
  const x0 = point.x
  const y0 = point.y
  const x1 = A.x
  const y1 = A.y
  const x2 = B.x
  const y2 = B.y

  if (x1 === x2) {
    return {
      x: x1,
      y: y0
    }
  } else if (y1 === y2) {
    return {
      x: x0,
      y: y1
    }
  }

  const k = (y2 - y1) / (x2 - x1)
  const x = (k * k * x1 + k * (y0 - y1) + x0) / (k * k + 1)
  const y = k * (x - x1) + y1
  return {
    x,
    y
  }
}

/**
 * 计算位置偏移，若小于 0 则返回 0
 * @param pos 位置
 * @param offset 偏移
 * @returns 最终位置
 */
export function calcOffsetPosition(pos: number | string, offset: number | string) {
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