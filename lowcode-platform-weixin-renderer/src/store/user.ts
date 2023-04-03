import { defineStore } from 'pinia';

import { LOCAL_STORAGE_KEY_OF_TOKEN, LOCAL_STORAGE_KEY_OF_USERINFO } from 'lowcode-platform-common/common/index';
import { checkIsLogin } from 'lowcode-platform-weixin-renderer/api/user';

/** 用户 Store */
export interface UserStore {
  isLogin: boolean;
  username: string;
  avatar: string;
  starCommodities: string[],
  starShops: string[],
  payingOrderNumber: number;
  preparingOrderNumber: number;
  deliveringOrderNumber: number;
}

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      isLogin: false,
      username: '',
      avatar: '',
      starCommodities: [],
      starShops: [],
      payingOrderNumber: 0,
      preparingOrderNumber: 0,
      deliveringOrderNumber: 0,
    }
  },
  actions: {
    /** 设置登录的用户信息 */
    setLoginUserInfo(username: string, avatar: string, token: string) {
      this.username = username;
      this.avatar = avatar;
      this.isLogin = true;
      // 设置 LocalStorage 的登录信息
      uni.setStorageSync(`${LOCAL_STORAGE_KEY_OF_USERINFO}`, JSON.stringify({
        username: this.username,
        avatar: this.avatar,
      }));
      // 持久化存储
      uni.setStorageSync(`${LOCAL_STORAGE_KEY_OF_TOKEN}`, token);
    },
    /** 清楚登录的用户信息 */
    clearLoginUserInfo() {
      this.isLogin = false;
      this.username = '';
      this.avatar = '';
      this.starCommodities = [];
      this.starShops = [];
      this.payingOrderNumber = 0;
      this.preparingOrderNumber = 0;
      this.deliveringOrderNumber = 0;
      // 清除存储在 LocalStorage 的登录信息
      uni.removeStorageSync(`${LOCAL_STORAGE_KEY_OF_USERINFO}`);
      uni.removeStorageSync(`${`${LOCAL_STORAGE_KEY_OF_TOKEN}`}`);
    },
    /** 判断是否登录 */
    async checkLogin() {
      const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN);
      if(!token) return false;
      const res = await checkIsLogin();
      if(!res) {
        this.isLogin = false;
      };

      return res;
    }
  }
})