import type { Context, Next } from 'koa';

import { StatusCode } from '../const';
import { verifyToken } from '../utils/jwt';

// 校验白名单
const authWhiteList = [
  '/user/login',
  '/user/register',
]

// 校验 token
export default async (ctx: Context, next: Next) => {
 try {
  if(!authWhiteList.includes(ctx.url) && !isStaticAssets(ctx.url)) {
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

/**
 * 判断资源请求是否为静态资源
 * @param url 资源请求 url
 * @returns 资源请求是否为静态资源
 */
function isStaticAssets(url: string) {
  if(/^\/images\/(.*)/.test(url) || url === '/favicon.ico') return true;
  return false;
}
