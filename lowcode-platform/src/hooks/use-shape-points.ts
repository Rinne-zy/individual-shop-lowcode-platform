import { ref } from "vue";

import { getHeightPxNumber, getWidthPxNumber, transformPxToNumber } from 'lowcode-platform/utils/unit';
import { mod360 } from 'lowcode-platform/utils/rotate';
import type { Point } from 'lowcode-platform/utils/position';

// 控制点
export enum Points {
  Left = 'l',
  LeftTop = 'lt',
  Top = 't',
  RightTop = 'rt',
  Right = 'r',
  RightBottom = 'rb',
  Bottom = 'b',
  LeftBottom = 'lb',
}

// 点位置
const points = [Points.Left, Points.LeftTop, Points.Top, Points.RightTop, Points.Right, Points.RightBottom, Points.Bottom, Points.LeftBottom];

// 每个点对应的初始角度
const initialAngleByPoint: Record<Points, number> = { 
  [Points.Left]: 0,
  [Points.LeftTop]: 45,
  [Points.Top]: 90,
  [Points.RightTop]: 135,
  [Points.Right]: 180,
  [Points.RightBottom]: 225,
  [Points.Bottom]: 270,
  [Points.LeftBottom]: 315,
};

// 每个范围的角度对应的光标，每转过 22.5 度改变指针
const angleToCursor = [ 
  { start: 338, end: 23, cursor: 'w' },
  { start: 23, end: 68, cursor: 'nw' },
  { start: 68, end: 113, cursor: 'n' },
  { start: 113, end: 158, cursor: 'ne' },
  { start: 158, end: 203, cursor: 'e' },
  { start: 203, end: 248, cursor: 'se' },
  { start: 248, end: 293, cursor: 's' },
  { start: 293, end: 338, cursor: 'sw' },
];

export const shapePointsUpdateById: Record<string, (() => void)> = {};

/**
 * 执行控制点强制更新函数
 * @param id 
 */
export function execShapePointsForceUpdate(id: string) {
  const updateFunction = shapePointsUpdateById[id]
  if(typeof updateFunction === 'function') {
    updateFunction();
  }
}

/**
 * 获取指针
 * @param deg 旋转角
 * @returns 
 */
export function getCursor(deg = 0) {
  const rotate = mod360(deg);
  // 初始化
  const cursorByPoint: Record<Points, string> = {
    [Points.Left]: '',
    [Points.LeftTop]: '',
    [Points.Top]: '',
    [Points.RightTop]: '',
    [Points.Right]: '',
    [Points.RightBottom]: '',
    [Points.Bottom]: '',
    [Points.LeftBottom]: ''
  };

  // 获取从上一个匹配的索引开始
  let lastMatchedIndex = -1;
  
  points.forEach(point => {
    // 当前点的角度
    const angle = mod360(initialAngleByPoint[point] + rotate)
    const len = angleToCursor.length
    while (true) {
      lastMatchedIndex = (lastMatchedIndex + 1) % len;
      const angleLimit = angleToCursor[lastMatchedIndex];
      // 左侧
      if (angle < 23 || angle >= 338) {
        cursorByPoint[point] = 'w-resize';
        break;
      }
      // 判断范围设置相应点角度
      if (angleLimit.start <= angle && angle < angleLimit.end) {
        cursorByPoint[point] = `${angleLimit.cursor}-resize`;
        break;
      }
    }
  })

  return cursorByPoint;
}

/**
 * 获取 Shape 控制点中心对称点的位置（绝对定位）
 * @param style shape 样式，注意宽高需要先转成 px 数值
 * @param point 点
 * @returns 对称点的位置
 */
export function getSymmetryPointPosition(style: CSSStyleDeclaration, point: Points): Point {
  const left = transformPxToNumber(style.left);
  const top = transformPxToNumber(style.top);
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

export function usePointsShape() {
  const shapeRef = ref<HTMLElement>();
  // 旋转指针样式需要设置为响应式
  const cursorByPoint = ref(getCursor());

  // 获取最新的指针
  const getNowCursor = (deg: number) => {
    cursorByPoint.value = getCursor(deg);
  }

  // 获取点位置
  const getPointPositionStyle = (point: Points) => {
    if(!shapeRef.value) return {
      display: 'none',
    }

    // 获取容器宽度和高度
    const width = shapeRef.value.offsetWidth;
    const height = shapeRef.value.offsetHeight;

    // 判断点位置
    const hasT = /t/.test(point);
    const hasB = /b/.test(point);
    const hasL = /l/.test(point);
    const hasR = /r/.test(point);
    let newLeft = 0
    let newTop = 0

    // 四个角的点
    if (point.length === 2) {
      newLeft = hasL ? 0 : width;
      newTop = hasT ? 0 : height;
    } else {
      // 上下两点的点，宽度居中
      if (hasT || hasB) {
          newLeft = width / 2
          newTop = hasT ? 0 : height;
      }

      // 左右两边的点，高度居中
      if (hasL || hasR) {
          newLeft = hasL ? 0 : width;
          newTop = Math.floor(height / 2);
      }
    }

    return {
      marginLeft: '-4px',
      marginTop: '-4px',
      left: `${newLeft}px`,
      top: `${newTop}px`,
      cursor: cursorByPoint.value[point],
    }
  }

  return {
    points,
    shapeRef,
    getNowCursor,
    getPointPositionStyle
  }
}
