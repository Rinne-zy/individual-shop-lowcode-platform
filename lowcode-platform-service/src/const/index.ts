/** 请求状态码 */
export enum StatusCode {
  /** 未登录 */
  AuthError = 40001,
  /** 业务逻辑错误状态码 */
  Error = -1,
  /** 成功状态码 */
  Success = 0,
}
/** jwt 加密的 key */
export const jwtKey = 'bG93Y29kZS1wbGF0Zm9ybQ==';
