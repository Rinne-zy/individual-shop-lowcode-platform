import { ref } from "vue";
import { mod360 } from 'lowcode-platform/utils/translate';

// 点位置
const points = ['l', 'lt', 't', 'tr', 'r', 'rb', 'b', 'lb'];

// 每个点对应的初始角度
const initialAngleByPoint: Record<string, number> = { 
  l: 0,
  lt: 45,
  t: 90,
  tr: 135,
  r: 180,
  rb: 225,
  b: 270,
  lb: 315,
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

/**
 * 获取指针
 * @param deg 旋转角
 * @returns 
 */
export function getCursor(deg = 0) {
  const rotate = mod360(deg);
  const cursorByPoint: Record<string, string> = {};
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


export function usePointsShape() {
  const shapeRef = ref<HTMLElement>();
  let cursorByPoint: Record<string, string> = getCursor();

  // 获取最新的指针
  const getNowCursor = () => {
    cursorByPoint = getCursor();
  }

  // 获取点位置
  const getPointPositionStyle = (point: string) => {
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
      cursor: cursorByPoint[point],
    }
  }

  return {
    points,
    shapeRef,
    getNowCursor,
    getPointPositionStyle,
  }
}