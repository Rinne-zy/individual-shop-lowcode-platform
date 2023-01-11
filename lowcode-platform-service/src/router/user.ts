import KoaRouter from 'koa-router';

import { login, register } from '../controller/user';
import type { User } from '../models/user';

// koa 路由实例
const router = new KoaRouter();

// 注册
router.post('/user/register', async (ctx) => {
  const { username, password, userType } = ctx.request.body as User;
  const res = await register(username, password, userType);
  ctx.body = res;
})

// 登录
router.post('/user/login', async (ctx) => {
  const { username, password } = ctx.request.body as User;
  const res = await login(username, password);
  ctx.body = res;
})

export default router;