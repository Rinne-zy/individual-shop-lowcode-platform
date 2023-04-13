import type { Context, Next } from 'koa';

import { StatusCode } from '../const';

// 统一错误处理逻辑
export default async (ctx: Context, next: Next) => {
    try{
      await next();
    } catch(err) {
      console.log(err);
      const msg = (err as Error).message;
      const code = ctx.state.statusCode || StatusCode.Error;
      ctx.body = {
        code,
        msg,
      }
    }
}