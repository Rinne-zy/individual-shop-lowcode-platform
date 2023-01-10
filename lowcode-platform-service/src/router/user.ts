import KoaRouter from 'koa-router';

import { login, register } from '../controller/user';
import type { User } from '../models/user';
import { StatusCode } from '../const';

// koa 路由实例
const router = new KoaRouter();

// 注册
router.post('/user/register', async (ctx) => {
  try {
    const { username, password, userType } = ctx.request.body as User;
    const res = await register(username, password, userType);
    ctx.body = res;
  } catch (err) {
    ctx.body = {
      code: StatusCode.Error,
      msg: `添加失败，${(err as Error).message}`,
    }
  }
})

// 登录
router.post('/user/login', async (ctx) => {
  try {
    const { username, password } = ctx.request.body as User;
    const res = await login(username, password);
    ctx.body = res;
  } catch (err) {
    ctx.body = {
      code: StatusCode.Error,
      msg: `登录失败，${(err as Error).message}`,
    }
  }
})

export default router;