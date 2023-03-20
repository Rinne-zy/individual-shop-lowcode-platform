import { defineStore } from 'pinia';
import { toRaw } from 'vue';

import { LOCAL_STORAGE_KEY_OF_TOKEN, LOCAL_STORAGE_KEY_OF_USERINFO } from 'lowcode-platform-h5-renderer/const';
import { setStorage, clearStorage } from 'lowcode-platform-h5-renderer/utils/storage';
import { checkIsLogin } from 'lowcode-platform-h5-renderer/api/user';

/** 用户 Store */
export interface UserStore {
  isLogin: boolean;
  checkLoginPromise: Promise<boolean> | null;
  username: string;
  avatar: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      isLogin: false,
      checkLoginPromise: null,
      username: '',
      avatar: '',
    }
  },
  actions: {
    /** 设置登录的用户信息 */
    setLoginUserInfo(username: string, avatar: string, token: string) {
      this.username = username;
      this.avatar = avatar;
      this.isLogin = true;
      // 设置 LocalStorage 的登录信息
      setStorage(`${LOCAL_STORAGE_KEY_OF_USERINFO}`, JSON.stringify({
        username: this.username,
        avatar: this.avatar,
      }));
      // 持久化存储
      setStorage(`${LOCAL_STORAGE_KEY_OF_TOKEN}`, token);
    },
    /** 清楚登录的用户信息 */
    clearLoginUserInfo() {
      this.isLogin = false;
      this.username = '';
      this.avatar = '';
      // 清除存储在 LocalStorage 的登录信息
      clearStorage(`${LOCAL_STORAGE_KEY_OF_USERINFO}`);
      clearStorage(`${LOCAL_STORAGE_KEY_OF_TOKEN}`);
    },
    /** 判断是否登录 */
    async checkLogin() {
      const token = localStorage.getItem(`${LOCAL_STORAGE_KEY_OF_TOKEN}`);
      if(!token) return false;
      const res = await (this.checkLoginPromise || (this.checkLoginPromise = checkIsLogin()));
      if(!res) {
        this.isLogin = false;
      };

      return res;
    }
  }
})