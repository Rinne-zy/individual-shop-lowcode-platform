import type { Context, Next } from 'koa';

import { verifyToken } from '../utils/jwt';

// 校验白名单
const authWhiteList = [
  '/user/login',
  '/user/register'
]

// 统一错误处理逻辑
export default async (ctx: Context, next: Next) => {
  if(!authWhiteList.includes(ctx.url)) {
    verifyToken(ctx.header.authorization || '');
  }
  await next();
}