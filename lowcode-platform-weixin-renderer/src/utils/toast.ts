/**
 * 展示成功提示
 * @param msg 
 */
export function showSuccessToast(msg: string) {
  uni.showToast({
    duration: 1500,
    title: msg,
    icon: 'success',
  })
}

/**
 * 展示失败提示
 * @param msg 
 */
export function showFailToast(msg: string) {
  uni.showToast({
    duration: 1500,
    title: msg,
    icon: 'error',
  })
}