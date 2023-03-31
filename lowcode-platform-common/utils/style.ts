/**
 * 将 px 单位转换成 vw
 * @param pixelValue 像素单位
 * @param viewPortWidth 屏幕宽度
 * @param unitPrecision 最小转换单位值
 * @returns 
 */
export function transformPxToVw(pixelValue: number, viewPortWidth: number, unitPrecision = 5) {
  if(unitPrecision >= pixelValue) return `${pixelValue}px`;
  return `${(pixelValue * 100 / viewPortWidth).toFixed(unitPrecision)}vw`;
}

/**
 * 获取基于视口宽度的组件样式(宽度、定位、旋转角)
 * @param style 原始样式
 * @param viewPortWidth 视口宽度
 * @returns 
 */
export function getComponentStyleToViewPort(style: Record<string, any>, viewPortWidth = 375) {
  const commonStyle: Record<string, string> = {};
  Object.keys((style)).forEach((key) => {
    commonStyle[key] = transformPxToVw(style[key], viewPortWidth);
  })

  return {
    ...commonStyle,
    height: `fit-content`,
    top: `${style.top}px`,
    rotate: `${style.rotate}deg`,
  }
}