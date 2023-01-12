import type { Context, Next } from 'koa';

import { StatusCode } from '../const';
import { verifyToken } from '../utils/jwt';

// 校验白名单
const authWhiteList = [
  '/user/login',
  '/user/register'
]

// 校验 token
export default async (ctx: Context, next: Next) => {
 try {
  if(!authWhiteList.includes(ctx.url)) {
    const userInfo = verifyToken(ctx.header.authorization || '');
    // 设置传递的用户信息
    ctx.state.userInfo = userInfo;
  }
  await next();
 } catch(err) {
   // 捕获认证失败，设置未认证状态码
   ctx.state.statusCode = StatusCode.AuthError;
   throw err;
 }
}