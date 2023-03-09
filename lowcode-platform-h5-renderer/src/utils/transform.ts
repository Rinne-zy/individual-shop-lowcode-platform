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