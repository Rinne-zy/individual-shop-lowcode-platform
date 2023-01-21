import type { Point } from "./position";

/**
 * 获取旋转角正角
 * @param deg 旋转角
 * @returns 正角旋转角
 */
export function mod360(deg: number) {
  return (deg + 360) % 360;
}

/**
 * 获取绕中心点旋转后的点的坐标
 * @param point 旋转点
 * @param centerPoint 中心点
 * @param deg 旋转角
 * @returns 旋转后点坐标
 */
export function rotate(point: Point, centerPoint: Point, deg: number) {
  const sin = Math.sin(deg * Math.PI / 180);
  const cos = Math.cos(deg * Math.PI / 180);
  // 将旋转中心点平移至原点
  const x = point.x - centerPoint.x;
  const y = point.y - centerPoint.y;
  // 旋转矩阵
  const x1 = x * cos + y * sin;
  const y1 = -x * sin + y * cos;
  return {
    x: x1 + centerPoint.x,
    y: y1 + centerPoint.y
  }
}