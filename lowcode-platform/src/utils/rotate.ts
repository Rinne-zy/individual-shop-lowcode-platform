import { CommonStyleSchema } from "lowcode-platform/packages/types";
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

/**
 * 获取旋转后组件的包围盒
 * @param style 组件样式
 * @returns 组件包围盒样式信息
 */
export function getComponentRotatedStyle(style: CommonStyleSchema) {
  const { rotate, width, height } = style;
  if (!rotate) {
    return {
      ...style,
      bottom: style.top + height,
      halfWidth: width / 2,
      right: style.left + width,
      halfHeight: height / 2,
    }
  };

  const sin = Math.sin(rotate * Math.PI / 180);
  const cos = Math.cos(rotate * Math.PI / 180);
  
  // 计算旋转后的样式
  const newWidth = width * cos + height * sin;
  const newLeft = style.left - (newWidth - width) / 2;
  const newHeight = width * sin + height * cos;
  const newTop = style.top - (newHeight - height) / 2;

  return {
    left: newLeft,
    top: newTop,
    width: newWidth,
    halfWidth: newWidth / 2, 
    height: newHeight,
    halfHeight: newHeight / 2,
    right: newLeft + newWidth,
    bottom: newTop + newHeight,
    rotate,
  }
}