import { showFailToast } from 'lowcode-platform-weixin-renderer/utils/toast';
import { useUserStore } from "lowcode-platform-weixin-renderer/store/user";

let handleFailToast: ((msg: string) => void) | undefined = undefined;

export function setHandleFailToast(fn: ((msg: string) => void) | undefined) {
  handleFailToast = fn;
}

/**
 * 处理未登录的情况
 * @param code 状态码
 */
export function handleErrorCode(code: number, msg: string) {
  const userStore = useUserStore();
  handleErrorFailToast(msg);
  if(code === 40001) {
    userStore.clearLoginUserInfo();
    setTimeout(() => {
      uni.reLaunch({
        url: 'pages/my-info/index'
      });
    }, 1000)
  };
  throw new Error(msg);
}

function handleErrorFailToast(msg: string) {
  if(typeof handleFailToast === 'function') {
    handleFailToast(msg);
    handleFailToast = undefined;
    return;
  }

  showFailToast(msg);
}