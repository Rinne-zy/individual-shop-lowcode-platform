import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { Points } from 'lowcode-platform/hooks/use-shape-points-hook';
import { getRotateDeg, transformPxToNumber } from 'lowcode-platform/utils/unit';
import type { Ref } from "vue";
import { rotate } from './rotate';
import { getVerticalPointInLine, getContainerCenterPointPosition, Point, getSymmetryPointPosition } from './point';

/**
 * 处理放缩形变
 * @param ref 放缩的 DOM
 * @param point 放缩控制点
 * @returns 
 */
export function handleScaleTransform(ref: Ref<HTMLElement>, point: Points, isProportion = false) {
  const parent = ref.value.parentElement
  const store = useSchemaStore();
  // 获取画布容器
  const parentRect = parent!.getBoundingClientRect();
  const { style } = ref.value;

  // 获取当前滚动条的高度
  const scrollTop = parent!.scrollTop;

  // 旋转前固定点
  const originFixPoint = getSymmetryPointPosition(style, point, scrollTop);
  // 中心点
  const centerPoint = getContainerCenterPointPosition(style, scrollTop);
  // 旋转角
  const rotateDeg = getRotateDeg(style.rotate);
  // 旋转后固定点
  const fixPoint = rotate(originFixPoint, centerPoint, -rotateDeg);

  return (e: MouseEvent) => {
    // 利用屏幕坐标计算出当前左上角的点的 left 和 top
    let current = {
      x: e.pageX - parentRect.x,
      y: e.pageY - parentRect.y,
    }

    // 对称放缩
    if (isProportion) {
      current = getVerticalPointInLine(current, fixPoint, centerPoint)
    }

    // 新的中心点
    const newCenterPoint = {
      x: (current.x + fixPoint.x) / 2,
      y: (current.y + fixPoint.y) / 2
    }

    // 旋转前的位置
    const beforeRotateFixPoint = rotate(fixPoint, newCenterPoint, rotateDeg);
    const beforeRotateCurrentPoint = rotate(current, newCenterPoint, rotateDeg);

    const newStyle = getScaleTransformStyle(point, beforeRotateFixPoint, beforeRotateCurrentPoint, style);
    // 修正 top
    newStyle.top += parent!.scrollTop;

    return newStyle;
  }
}

/**
 * 根据不同的控制点获取放缩形变的样式
 * @param point 放缩控制点
 * @param fixPoint 旋转前固定点
 * @param currentPoint 旋转前左上角点
 * @param style 原来样式
 * @returns 放缩形变的样式
 */
function getScaleTransformStyle(point: Points, fixPoint: Point, currentPoint: Point, style: CSSStyleDeclaration) {
  const width = transformPxToNumber(style.width);
  const height = transformPxToNumber(style.height);

  if(point === Points.Bottom || point === Points.Top) return {
    left: fixPoint.x - width / 2,
    top: Math.min(fixPoint.y, currentPoint.y),
    height: Math.abs(fixPoint.y - currentPoint.y),
  }

  if(point === Points.Left || point === Points.Right) return {
    width: Math.abs(fixPoint.x - currentPoint.x),
    left: Math.min(fixPoint.x, currentPoint.x),
    top: fixPoint.y - height / 2,
  }

  return {
    width: Math.abs(fixPoint.x - currentPoint.x),
    height: Math.abs(fixPoint.y - currentPoint.y),
    left: Math.min(fixPoint.x, currentPoint.x),
    top: Math.min(fixPoint.y, currentPoint.y),
  }
}
