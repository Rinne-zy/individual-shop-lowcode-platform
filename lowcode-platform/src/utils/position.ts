/**
 * 计算中心位置
 * @param width 宽度
 * @param height 高度
 * @param left 左边绝对定位
 * @param top 顶部绝对定位
 */
export function calcCenterPositionStyle(width: string | number, height: string | number, left: string | number, top: string | number) {
  console.log(width, height, left, top);
  const w = transformPxToNumber(width);
  const h = transformPxToNumber(height);
  const l = transformPxToNumber(left);
  const t = transformPxToNumber(top);

  return {
    left: `${l - w / 2}px`,
    top: `${t - h / 2}px`
  }
}

/**
 * 获取 px 数值
 * @param px css 像素
 * @returns px 数值
 */
export function transformPxToNumber(px: string | number) {
  if(typeof px === 'number') return px;
  return +(px.split('px')[0]);
}