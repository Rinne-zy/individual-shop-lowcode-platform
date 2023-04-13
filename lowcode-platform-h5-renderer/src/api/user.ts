import { showFailToast, showSuccessToast } from "vant";

import { LOCAL_STORAGE_KEY_OF_TOKEN, FETCH_URL_PREFIX } from "lowcode-platform-common/common/index";
import { handleNotLogin } from "lowcode-platform-h5-renderer/utils/login";

/**
 * 判断是否登录
 * @returns 
 */
export async function checkIsLogin() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}user/isLogin`, {
    headers: {
      Authorization: token,
    }
  });

  if(resp.status !== 200 || !resp.ok) {
    return false;
  };
  const { code } = await resp.json();

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
  const resp = await fetch(`${FETCH_URL_PREFIX}user/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
    })
  });

  if(resp.status !== 200 || !resp.ok) {
    return false;
  };
  const { code, msg, data, token } = await resp.json();

  if(code !== 0) {
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(msg);
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
  const resp = await fetch(`${FETCH_URL_PREFIX}user/register`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
      userType,
    })
  });

  if(resp.status !== 200 || !resp.ok) {
    return false;
  };
  const { code, msg } = await resp.json();

  if(code !== 0) {
    showFailToast(`${msg}，请稍后再试！`);
  };

  showSuccessToast(`${msg}，请快去登录吧！`);
}

/**
 * 获取用户收藏的商品
 * @returns 
 */
export async function getUserStarCommodities() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}user/starCommodities`, {
    headers: {
      Authorization: token,
    },
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('获取地址请求异常');
  const { code, msg, commodities } = await resp.json();

  if(code) {
    const notLogin = handleNotLogin(code);
    showFailToast(notLogin ? '登录信息已过期，请重新登录！' : msg);
    throw new Error(msg);
  }

  return commodities as Record<string, boolean>;
};


/**
 * 获取用户收藏的商城
 * @returns 
 */
export async function getUserStarShops() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}user/starShops`, {
    headers: {
      Authorization: token,
    },
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('获取用户收藏商店请求异常');
  const { code, msg, shops } = await resp.json();

  if(code) {
    const notLogin = handleNotLogin(code);
    showFailToast(notLogin ? '登录信息已过期，请重新登录！' : msg);
    throw new Error(msg);
  }

  return shops as Record<string, boolean>;
};


/**
 * 获取用户收藏的商品
 * @returns 
 */
export async function getUserStarInfo() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}user/starInfo`, {
    headers: {
      Authorization: token,
    },
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('获取用户收藏信息异常');
  const { code, msg, shops, commodities } = await resp.json();

  if(code) {
    const notLogin = handleNotLogin(code);
    showFailToast(notLogin ? '登录信息已过期，请重新登录！' : msg);
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
 * 微信认证
 * @param verifyCode 认证 code
 * @returns 
 */
export async function wxAuth(verifyCode: string) {
  const resp = await fetch(`${FETCH_URL_PREFIX}user/wx/h5/auth`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: verifyCode
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('微信登录失败');
  const { code, msg, data, token } = await resp.json();


  if(code) {
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(msg);
  return {
    data,
    token
  };
}

/**
 * 微信登录
 * @param openId 微信 openId
 * @returns 
 */
export async function wxLogin(openId: string) {
  const resp = await fetch(`${FETCH_URL_PREFIX}user/wx/h5/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      openId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('微信登录失败');
  const { code, msg, data, needToAuth, token } = await resp.json();

  if(code) {
    if(needToAuth) {
      return null;
    };
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(msg);
  return {
    data,
    token
  };
}