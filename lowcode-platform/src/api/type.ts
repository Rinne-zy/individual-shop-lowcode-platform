// 状态码
export enum StatusCode {
  Error = -1,
  Success = 0,
}

// 请求响应信息
export interface BaseResp {
  code: StatusCode,
  msg: string,
}
