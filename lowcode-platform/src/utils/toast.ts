import { ElMessage, ElMessageBox } from 'element-plus';

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

/**
 * 展示确认框
 * @param confirmCallback 确认回调
 * @param cancelCallback 取消回调
 */
export async function showConfirmMessage(confirmCallback: () => any, cancelCallback: () => any) {
  try {
    await ElMessageBox.confirm(
      '当前编辑尚未保存，是否需要保存再离开?', 
      'Confirm',
      {
        distinguishCancelAndClose: true,
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        confirmButtonText: '立即保存',
        cancelButtonText: '直接离开',
      }
    );
    // 确认回调
    return confirmCallback();
  } catch (err) {
    // 取消回调
    return cancelCallback();
  }
}