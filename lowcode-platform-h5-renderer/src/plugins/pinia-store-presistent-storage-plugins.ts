import type { PiniaPluginContext } from 'pinia';

import { getStorage } from 'lowcode-platform-h5-renderer/utils/storage';
import { LOCAL_STORAGE_KEY_OF_TOKEN, LOCAL_STORAGE_KEY_OF_USERINFO } from 'lowcode-platform-h5-renderer/const';
/**
 * 使用 Pinia 持久化存储插件
 * @param context pinia store 上下文
 */
export const usePiniaPersistentStoragePlugin = (context: PiniaPluginContext) => {
  // 用户信息
  const userInfo = getStorage(`${LOCAL_STORAGE_KEY_OF_USERINFO}`);
  // token
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  // 是否登录
  const isLogin = !!(token && userInfo);

  return {
    ...userInfo,
    token,
    isLogin
  }
}

