import { FETCH_URL_PREFIX, LOCAL_STORAGE_KEY_OF_TOKEN } from 'lowcode-platform-common/common/index';

export interface RequestOptions {
  // 请求地址
  url: string;
  // 是否使用 token
  header: any;
  // 请求
  data: any;
};

/**
 * 封装的 post 请求
 * @param options 
 * @returns 
 */
export function post<ReturnType>(options: Partial<RequestOptions>) {
  // post 请求头
  const header = {
    ...options.header,
    Authorization: uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN),
    'Content-Type': 'application/json'
  };

  return new Promise<ReturnType>((resolve, reject) => {
    uni.request({
      url: `${FETCH_URL_PREFIX}${options.url}`,
      method: 'POST',
      data: options.data || {},
      header: header,      
    }).then(data => {   
        resolve(data.data as ReturnType);
    }).catch(error => {
        reject(error)
    })
  })
}

/**
 * 封装的 get 请求
 * @param options 
 * @returns 
 */
export function get<ReturnType>(options: Partial<RequestOptions>) {
  return new Promise<ReturnType>((resolve, reject) => {
    uni.request({
      url: `${FETCH_URL_PREFIX}${options.url}`,
      method: 'GET',
      data: options.data || {},
      header: options.header || {}, 
    }).then(data => {   
        resolve(data.data as ReturnType);
    }).catch(error => {
        reject(error)
    })
  })
}