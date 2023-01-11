import type { PiniaPluginContext } from 'pinia';

import { PREFIX_FOR_LOCAL_STORAGE } from 'lowcode-platform/const';
import { getStorage } from 'lowcode-platform/utils/storage';

/**
 * 使用 Pinia 持久化存储插件
 * @param context pinia store 上下文
 */
export const usePiniaPersistentStoragePlugin = (context: PiniaPluginContext) => {
  const { store } = context;
  // 每次构建项目的时候从本地存储取值
  const data = getStorage(`${PREFIX_FOR_LOCAL_STORAGE}-${store.$id}`);
  return {
      ...data
  }
}

