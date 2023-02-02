import { reactive, ref } from "vue";
import type { FormInstance } from 'element-plus';

import { UserType } from './../store/user-store';
import { register } from "lowcode-platform/api/register";
import { showErrorMessage, showSuccessMessage } from "../utils/toast";
import { StatusCode } from "lowcode-platform/api/type";

export function useRegister() {
  // 注册表单数据
  const registerForm = reactive({
    username: '',
    password: '',
    userType: UserType.Merchant,
  });

  // 注册表单 DOM 引用
  const registerRef = ref<FormInstance>();
  
  // 校验并注册
  const validateAndRegister = (successCallback?: () => void) => {
    registerRef.value?.validate(async (valid) =>  {
      try {
        if(!valid) throw new Error('校验失败');
        const { username, password, userType } = registerForm;
        const { data } = await register(username, password, userType);
        // 注册失败
        if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
        // 注册成功
        showSuccessMessage('注册成功，快去登录吧！');
        successCallback?.();
      } catch(err) {
        showErrorMessage((err as Error).message);
      } 
    });
  };

  return {
    registerForm,
    validateAndRegister,
    registerRef
  }
}