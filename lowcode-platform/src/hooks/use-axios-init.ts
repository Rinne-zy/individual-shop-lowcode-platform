import { showErrorMessage } from 'lowcode-platform/hooks/use-message-toast';
import { useUserStore } from 'lowcode-platform/store/user-store';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

import type { BaseResp } from 'lowcode-platform/api/type';
import { StatusCode } from './../api/type';
import { JWT_TOKEN_KEY_FOR_LOCAL_STORAGE } from './../const/index';
import router from 'lowcode-platform/router';

// 无需鉴权的白名单
const authWhiteList = ['/user/login', '/user/register'];

/** 初始化 axios */
export function initAxios() {
  initAxiosConfig();
  initAxiosRequestInterceptor();
  initAxiosResponseInterceptor();
}

/** 初始化 axios 配置 */
function initAxiosConfig() {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

/** 设置 axios 请求拦截器 */
function initAxiosRequestInterceptor() {
  // 设置 axios 请求拦截器
  axios.interceptors.request.use((config: any) => {
    const { url } = config;
    
    let token = localStorage.getItem(JWT_TOKEN_KEY_FOR_LOCAL_STORAGE);
    if (!authWhiteList.includes(url) && token) {
      config.headers.Authorization = token;
    }

    return config
  }, err => {
    return Promise.reject(err);
  })
}

/** 设置 axios 响应拦截器 */
function initAxiosResponseInterceptor() {
  // 设置 axios 响应拦截器
  axios.interceptors.response.use((response: AxiosResponse) => {
    if(response.status !== 200) {
      showErrorMessage('请求出错，请重新刷新页面');
    }

    // 处理未登录情况
    if((response.data as BaseResp).code === StatusCode.AuthError) {
      const userStore = useUserStore();
      // 清除登录信息
      userStore.clearLoginUserInfo();
      localStorage.removeItem(JWT_TOKEN_KEY_FOR_LOCAL_STORAGE);
      showErrorMessage((response.data as BaseResp).msg, () => {
        // 回到登录页
        router.push('/login');
      }, 500);
    }

    return response;
  }, err => {
    return Promise.reject(err);
  })
}