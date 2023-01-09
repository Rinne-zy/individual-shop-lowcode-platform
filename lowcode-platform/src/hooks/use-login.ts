import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";

import { LOCAL_STORAGE_DATA_EXPRIES } from "lowcode-platform/const";
import { UserType, useUserStore } from "lowcode-platform/store/user-store";

/**
 * 检查用户是否登录
 * @return 是否已登录 
 */
export function checkIsLogin() {
  const userStore = useUserStore();
  const { userName, userType, expires } = userStore;
  // 超时或者非法 expires 时间
  if (!expires || Date.now() - expires > LOCAL_STORAGE_DATA_EXPRIES) {
    userStore.clearLoginUserInfo();
    return false;
  }

  // 非登录
  if(!userName || userType === UserType.NoLogin) return false;

  // 已登录
  return true;
}

/**
 * 使用登录功能
 */
export function useLogin() {
  const loginForm = reactive({
    username: '',
    password: '',
  });

  const loginRef = ref<FormInstance>();
  
  const login = () => {
    loginRef.value?.validate(async (valid) =>  {
      if (valid) {
        console.log('校验通过');
      } else {
        console.log('校验失败');
      }
    });
  };

  return {
    loginForm,
    login,
    loginRef
  }
}