import type { Context, Next } from 'koa';

import { verifyToken } from '../utils/jwt';

// 校验白名单
const authWhiteList = [
  '/user/login',
  '/user/register',
  '/commodity/getByIds'
]

// 校验 token
export default async (ctx: Context, next: Next) => {
  if(!authWhiteList.includes(ctx.url) && !isStaticAssets(ctx.url)) {
    const userInfo = verifyToken(ctx, ctx.header.authorization || '');
    // 设置传递的用户信息
    ctx.state.userInfo = userInfo;
  }
  await next();
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
