import type { PiniaPluginContext } from 'pinia';

import { LOCAL_STORAGE_KEY_OF_TOKEN, LOCAL_STORAGE_KEY_OF_USERINFO } from 'lowcode-platform-common/common/index';
/**
 * 使用 Pinia 持久化存储插件
 * @param context pinia store 上下文
 */
export const usePiniaPersistentStoragePlugin = (context: PiniaPluginContext) => {
  // 用户信息
  let userInfo = uni.getStorageSync(`${LOCAL_STORAGE_KEY_OF_USERINFO}`);
  userInfo = userInfo ? JSON.parse(userInfo) : {};
  // token
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  // 是否登录
  const isLogin = !!(token && userInfo);

  return {
    ...userInfo,
    isLogin
  }
}

