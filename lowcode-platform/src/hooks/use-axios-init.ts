import axios from 'axios';

/** 初始化 axios 配置 */
export function initAxiosConfig() {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}