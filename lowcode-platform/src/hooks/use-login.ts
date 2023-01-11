import { showErrorMessage, showSuccessMessage } from 'lowcode-platform/hooks/use-message-toast';
import { reactive, ref } from "vue";
import { useRouter } from 'vue-router';
import type { FormInstance } from "element-plus";

import { LOCAL_STORAGE_DATA_EXPRIES } from "lowcode-platform/const";
import { UserType, useUserStore } from "lowcode-platform/store/user-store";
import { login } from "lowcode-platform/api/login";
import { StatusCode } from 'lowcode-platform/api/type';

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
  
  // 校验并登录
  const validateAndLogin = (successLoginCallback: () => void) => {
    loginRef.value?.validate(async (valid) =>  {
      try {
        if(!valid) throw new Error('校验失败');
        const { data } = await login(loginForm.username, loginForm.password);
        // 登录失败
        if (!data || data.code !== StatusCode.Success || !data.data) throw new Error(data.msg);
        // 登录成功保存
        const { username, userType } = data.data;
        const userStore = useUserStore();
        userStore.setLoginUserInfo(username, userType)
        showSuccessMessage(`登录成功，欢迎${username}用户！`);
        successLoginCallback?.();
      } catch(err) {
        showErrorMessage((err as Error).message);
      } 
    });
  };

  return {
    loginForm,
    validateAndLogin,
    loginRef
  }
}