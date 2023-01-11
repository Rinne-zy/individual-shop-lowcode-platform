// 状态码
export enum StatusCode {
  /** 未登录 */
  AuthError = 40001,
  /** 业务逻辑错误状态码 */
  Error = -1,
  /** 成功状态码 */
  Success = 0,
}

// 请求响应信息
export interface BaseResp {
  /** 状态码 */
  code: StatusCode,
  /** 状态信息 */
  msg: string,
}
