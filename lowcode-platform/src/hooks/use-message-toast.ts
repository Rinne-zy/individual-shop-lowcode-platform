import { ElMessage } from 'element-plus';

/**
 * 提示成功
 * @param message toast 提示消息
 */
export function showSuccessMessage(message: string) {
  ElMessage({
    message,
    type: 'success',
  })
}

/**
 * 提示错误
 * @param message toast 提示消息
 */
export function showErrorMessage(message: string) {
  ElMessage({
    message,
    type: 'error',
  })
}