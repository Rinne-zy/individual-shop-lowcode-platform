import { transformPxToVw } from "./transform";

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
    height: `${style.height}px`,
    rotate: `${style.rotate}deg`,
  }
}