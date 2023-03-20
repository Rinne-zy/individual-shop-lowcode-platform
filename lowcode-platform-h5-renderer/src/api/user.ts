import { showFailToast, showSuccessToast } from "vant";

import { LOCAL_STORAGE_KEY_OF_TOKEN, FETCH_URL_PREFIX } from "lowcode-platform-h5-renderer/const";

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
    return {};
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