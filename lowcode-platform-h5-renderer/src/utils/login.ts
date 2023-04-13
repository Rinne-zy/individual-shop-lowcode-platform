import router from 'lowcode-platform-h5-renderer/router';
import { useUserStore } from "lowcode-platform-h5-renderer/store/user";

/**
 * 处理未登录的情况
 * @param code 状态码
 */
export function handleNotLogin(code: number, needToReload = false) {
  const userStore = useUserStore();
  if(code === 40001) {
    userStore.clearLoginUserInfo();
    // 重新加载
    if(needToReload) {
      setTimeout(() => {
        router.replace('/');
        location.reload();
      }, 1500);
    }
    return true;
  }

  return false;
}