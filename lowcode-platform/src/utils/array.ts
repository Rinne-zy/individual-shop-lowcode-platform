/**
 * 交换数组中的两个元素
 * @param data 数据数组
 * @param i 待交换的索引一
 * @param j 待交换的索引二
 */
export function swap<T>(data: Array<T>, i:number, j:number) {
  const temp = data[i]
  data[i] = data[j];
  data[j] = temp;
}