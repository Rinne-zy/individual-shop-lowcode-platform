import { useSchemaStore } from 'lowcode-platform/store/schema-store';
/**
 * 获取 px 数值
 * @param px css 像素
 * @returns px 数值
 */
export function transformPxToNumber(px: string | number) {
  if(typeof px === 'number') return px;
  return +(px.split('px')[0]);
}

/**
 * 获取旋转角度
 * @param deg 旋转角样式
 * @returns 
 */
export function getRotateDeg(deg: string | number) {
  if(typeof deg === 'number') return deg;
  return +deg.split('deg')[0];
}

/**
 * 获取宽度的 px 数值
 * @param width 宽度或高度
 * @returns 宽度的 px 数值
 */
export function getWidthPxNumber(width: string | number) {
  if(typeof width === 'number') return width;
  const schemaStore = useSchemaStore();
  const canvasWidth = transformPxToNumber(schemaStore.schema.editor.width);
  return width.includes('%') ? transformPxToNumber(width.split('%')[0]) * 0.01 * canvasWidth : transformPxToNumber(width);
}

/**
 * 获取高度的 px 数值
 * @param height 高度
 * @returns 高度的 px 数值
 */
export function getHeightPxNumber(height: string | number) {
  if(typeof height === 'number') return height;
  const schemaStore = useSchemaStore();
  const canvasHeight = transformPxToNumber(schemaStore.schema.editor.height);
  return height.includes('%') ? transformPxToNumber(height.split('%')[0]) * 0.01 * canvasHeight : transformPxToNumber(height);
}