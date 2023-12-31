import { showSuccessToast } from 'lowcode-platform-weixin-renderer/utils/toast';
import { LOCAL_STORAGE_KEY_OF_TOKEN } from "lowcode-platform-common/common/index";
import { handleErrorCode } from "lowcode-platform-weixin-renderer/utils/error";
import { get, post } from "./request";
import type { Shop } from "lowcode-platform-common/type/shop";
import type { StarCommodity } from 'lowcode-platform-common/type/commodity';


/**
 * 判断是否登录
 * @returns 
 */
export async function checkIsLogin() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  if(!token) return false;

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
    handleErrorCode(code, msg);
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
    handleErrorCode(code, msg);
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
    handleErrorCode(code, msg);
  }

  return shops as Record<string, boolean>;
};

/**
 * 获取用户收藏的商城信息
 * @returns 
 */
export async function getUserStarShopsInfo() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await get({
    url: 'user/starShopsInfo',
    header: {
      Authorization: token,
    }
  });

  const { code, msg, shops } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
  }

  return shops as Shop[];
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
    handleErrorCode(code, msg);
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
    handleErrorCode(code, msg);
  }

  return commodities as string[];
};

/**
 * 获取用户收藏的商品详情信息
 * @returns 
 */
export async function getUserStarCommoditiesInfo() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await get({
    url: 'user/starCommoditiesInfo',
    header: {
      Authorization: token,
    }
  });

  const { code, msg, commodities } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
  }

  return commodities as StarCommodity[];
};

/**
 * 微信小程序登录
 * @param wxCode 微信小程序登录码
 * @returns 
 */
export async function wxMiniProgramLogin(wxCode: string, nickname: string) {
  const resp = await post({
    url: 'user/wx/miniProgram/login',
    data: {
      code: wxCode,
      nickname,
    }
  });

  const { code, msg, data, token } = await resp as any;

  if(code !== 0) {
    handleErrorCode(code, msg);
  };

  showSuccessToast(msg);

  return {
    data,
    token
  };
}