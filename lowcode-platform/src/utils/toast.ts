import { ElMessage } from 'element-plus';

/**
 * 提示成功
 * @param message toast 提示消息
 */
export function showSuccessMessage(message: string, callback?: () => void, duration = 2000) {
  ElMessage({
    message,
    type: 'success',
    duration,
    onClose: callback,
  })
}

/**
 * 提示错误
 * @param message toast 提示消息
 */
export function showErrorMessage(message: string, callback?: () => void, duration = 2000) {
  ElMessage({
    message,
    type: 'error',
    duration,
    onClose: callback,
  })
}