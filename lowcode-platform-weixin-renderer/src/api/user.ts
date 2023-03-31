import { LOCAL_STORAGE_KEY_OF_TOKEN, FETCH_URL_PREFIX } from "lowcode-platform-common/common/index";
import { get } from "./request";

/**
 * 判断是否登录
 * @returns 
 */
export async function checkIsLogin() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await get({
    url: 'user/isLogin',
    header: {
      Authorization: token,
    }
  });

  const { code } = await resp as any;

  if(code !== 0) {
    return false;
  };

  return true;
};

/**
 * 获取用户收藏的商城
 * @returns 
 */
export async function getUserStarShops() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await get({
    url: 'user/starShops',
    header: {
      Authorization: token,
    }
  });

  const { code, msg, shops } = await resp as any;

  if(code) {
    throw new Error(msg);
  }

  return shops as Record<string, boolean>;
};
