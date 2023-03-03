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

/**
 * 比较两个数组是否相同
 * @param a1 数组1
 * @param a2 数组2
 * @param compareFn 比较方法
 * @returns 
 */
export function compareTwoArrayIsSame<T>(a1: Array<T>, a2: Array<T>, compareFn: (value: T, index: number) => boolean) {
  if(a1.length !== a2.length) return false;
  return a1.every(compareFn);
}