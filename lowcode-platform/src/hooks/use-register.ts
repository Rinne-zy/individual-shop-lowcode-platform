import { reactive, ref } from "vue";
import type { FormInstance } from 'element-plus';

import { UserType } from './../store/user-store';

export function useRegister() {
  const registerForm = reactive({
    username: '',
    password: '',
    userType: UserType.Merchant,
  });

  const registerRef = ref<FormInstance>();
  
  const register = () => {
    registerRef.value?.validate(async (valid) =>  {
      if (valid) {
        console.log('校验通过');
      } else {
        console.log('校验失败');
      }
    });
  };

  return {
    registerForm,
    register,
    registerRef
  }
}