import type { Context, Next } from 'koa';

import { StatusCode } from '../const';

// 统一错误处理逻辑
export default async (ctx: Context, next: Next) => {
    try{
      await next();
    } catch(err) {
      const msg = (err as Error).message;
      const code = /^未登录/.test(msg) ? StatusCode.AuthError : StatusCode.Error;
      ctx.body = {
        code,
        msg,
      }
    }
}