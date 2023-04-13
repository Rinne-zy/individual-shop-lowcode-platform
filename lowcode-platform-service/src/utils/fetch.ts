/**
 * 封装的 Promise 请求
 * @param url 请求 url
 * @returns 
 */
export function fetchJsonPromise<T>(url: string) {
  const fetch = require('node-fetch');
  return new Promise<T>((resolve, reject) => {
    fetch(url)
    .catch((err: any) => reject(err))
    .then((res: any) => res.json()).then((json: any) => resolve(json));
  });
};