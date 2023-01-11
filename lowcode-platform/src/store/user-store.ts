import { clearStorage } from 'lowcode-platform/utils/storage';
import { PREFIX_FOR_LOCAL_STORAGE } from 'lowcode-platform/const';
import { setStorage } from 'lowcode-platform/utils/storage';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

/** 用户类型 */
export enum UserType {
  NoLogin = 0,
  Customer = 1,
  Merchant = 2,
}

/** 用户 Store */
export interface UserStore {
  userName: string;
  userType: UserType;
  expires: number;
}

export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      userName: '',
      userType: UserType.NoLogin,
      expires: 0,
    }
  },
  actions: {
    /** 设置登录的用户信息 */
    setLoginUserInfo(userName: string, userType: UserType) {
      // 设置基本的用户信息
      this.userName = userName;
      this.userType = userType;
      this.expires = Date.now();
      // 持久化存储
      setStorage(`${PREFIX_FOR_LOCAL_STORAGE}-${this.$id}`, JSON.stringify(toRaw(this.$state)));
    },
    /** 清楚登录的用户信息 */
    clearLoginUserInfo() {
      this.userName = '';
      this.userType = UserType.NoLogin;
      this.expires = 0;
      clearStorage(`${PREFIX_FOR_LOCAL_STORAGE}-${this.$id}`);
    }
  }
})