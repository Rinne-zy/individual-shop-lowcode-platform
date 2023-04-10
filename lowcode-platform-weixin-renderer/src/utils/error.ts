import { showFailToast } from 'lowcode-platform-weixin-renderer/utils/toast';
import { useUserStore } from "lowcode-platform-weixin-renderer/store/user";

/**
 * 处理未登录的情况
 * @param code 状态码
 */
export function handleErrorCode(code: number, msg: string) {
  const userStore = useUserStore();
  showFailToast(msg);
  if(code === 40001) {
    userStore.clearLoginUserInfo();
    setTimeout(() => {
      uni.reLaunch({
        url: 'pages/my-info/index'
      });
    }, 1000)
  } else {
    throw new Error(msg)
  }
}