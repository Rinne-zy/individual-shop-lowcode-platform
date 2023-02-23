import { Points } from "lowcode-platform/hooks/use-shape-points-hook";
import { transformPxToNumber, getWidthPxNumber, getHeightPxNumber } from "./unit";

/** 坐标点 */
export interface Point  {
  x: number,
  y: number,
}

/**
 * 获取 Shape 控制点中心对称点的位置（绝对定位）
 * @param style shape 样式，注意宽高需要先转成 px 数值
 * @param point 点
 * @param scrollTop 滚动高度
 * @returns 对称点的位置
 */
export function getSymmetryPointPosition(style: CSSStyleDeclaration, point: Points, scrollTop = 0): Point {
  const left = transformPxToNumber(style.left);
  // 由于计算是基于屏幕坐标，因此需要根据父元素滚动条距离修正 top 值
  const top = transformPxToNumber(style.top) - scrollTop;
  const width = getWidthPxNumber(style.width);
  const height = getHeightPxNumber(style.height);

  switch(point) {
    case Points.LeftTop: return {
      x: left + width,
      y: top + height
    }
    case Points.RightTop: return {
      x: left,
      y: top + height,
    }
    case Points.LeftBottom: return {
      x: left + width,
      y: top,
    }
    case Points.RightBottom: return {
      x: left,
      y: top,
    }
    case Points.Left: return {
      x: left + width,
      y: top + height / 2,
    }
    case Points.Right: return {
      x: left,
      y: top + height / 2,
    }
    case Points.Top: return {
      x: left + width / 2,
      y: top + height,
    }
    case Points.Bottom: return {
      x: left + width / 2,
      y: top,
    }
  }
}

/**
 * 获取容器的中心点的绝对定位坐标（基于父容器）
 * @param style 样式
 * @param scrollTop 父元素滚动条高度
 * @returns 样式中心点的绝对定位坐标（基于父容器）
 */
export function getContainerCenterPointPosition(style: CSSStyleDeclaration, scrollTop = 0) {
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
 * 计算两个点的中心点的绝对定位坐标
 * @param p1 点
 * @param p2 点
 * @returns 中心点的绝对定位坐标
 */
export function getCenterPoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  }
}

/**
 * 过点 point 做垂线交AB于点C，返回点C
 * @param point 已知点
 * @param A 点A
 * @param B 点B
 * @returns 垂点基于父容器的绝对定位坐标
 */
export function getVerticalPointInLine (point: Point, A: Point, B: Point) {
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