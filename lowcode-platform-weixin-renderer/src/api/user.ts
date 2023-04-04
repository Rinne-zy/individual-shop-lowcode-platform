import { LOCAL_STORAGE_KEY_OF_TOKEN } from "lowcode-platform-common/common/index";
import { showFailToast } from "lowcode-platform-weixin-renderer/utils/toast";
import { get, post } from "./request";

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
 * 登录
 * @param username 用户名
 * @param password 密码 
 * @returns 
 */
export async function login(username: string, password: string) {
  const resp = await post({
    url: 'user/login',
    data: {
      username,
      password,
    }
  })

  const { code, msg, data, token } = await resp as any;

  uni.showToast({
    title: msg,
    duration: 1500
  });

  if(code !== 0) {
    throw new Error(msg);
  };

  return {
    ...data,
    token
  };
}

/**
 * 登录
 * @param username 用户名
 * @param password 密码 
 * @returns 
 */
export async function register(username: string, password: string, userType: number) {
  const resp = await post({
    url: 'user/register',
    data: {
      username,
      password,
      userType,
    }
  })

  const { code, msg } = await resp as any;

  uni.showToast({
    title: msg,
    duration: 1500
  });

  if(code !== 0) {
    throw new Error(msg);
  };

}

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

/**
 * 获取用户收藏的商品
 * @returns 
 */
export async function getUserStarInfo() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await get({
    url: 'user/starInfo',
    header: {
      Authorization: token,
    }
  });

  const { code, msg, shops, commodities } = await resp as any;

  if(code) {
    throw new Error(msg);
  }

  return {
    shops,
    commodities
  } as {
    shops: string[]
    commodities: string[]
  }
};

/**
 * 获取用户收藏的商品
 * @returns 
 */
export async function getUserStarCommodities() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await get({
    url: 'user/starCommodities',
    header: {
      Authorization: token,
    }
  });

  const { code, msg, commodities } = await resp as any;

  if(code) {
    showFailToast(msg);
    throw new Error(msg);
  }

  return commodities as Record<string, boolean>;
};