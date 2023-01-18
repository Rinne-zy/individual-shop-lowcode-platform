/**
 * 获取旋转角正角
 * @param deg 旋转角
 * @returns 正角旋转角
 */
export function mod360(deg: number) {
  return (deg + 360) % 360;
}