import { StatusCode } from './../const/index';
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

// 判断是否登录
router.get('/user/isLogin', async (ctx) => {
  const { username } = ctx.request.body as User;
  ctx.body = {
    code: StatusCode.Success,
    msg: '已登录',
    username,
  };
})

export default router;