/**
 * 设置 LocalStorage
 * @param key LocalStorage 的 key
 * @param value 存储到对应 key 的 JSON 化字符串
 */
export function setStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}

/**
 * 清理 LocalStorage
 * @param key LocalStorage 的 key
 */
 export function clearStorage(key: string) {
  localStorage.removeItem(key);
}

/**
 * 获取 LocalStorage
 * @param key LocalStorage 的 key
 * @return 存储到对应 key 的值
 */
export function getStorage(key: string) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
}
