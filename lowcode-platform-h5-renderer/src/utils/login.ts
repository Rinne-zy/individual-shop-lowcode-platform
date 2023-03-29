import { useUserStore } from "lowcode-platform-h5-renderer/store/user";
import { useRouter } from "vue-router";

/**
 * 处理未登录的情况
 * @param code 状态码
 */
export function handleNotLogin(code: number) {
  const userStore = useUserStore();
  if(code === 40001) {
    userStore.isLogin = false;
  }
}