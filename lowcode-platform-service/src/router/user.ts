import { StatusCode } from './../const/index';
import KoaRouter from 'koa-router';

import { getUserStarCommodities, login, register, getUserStarShops, getUserStarInfo, getUserStarCommoditiesInfo, getUserStarShopsInfo } from '../controller/user';
import type { User } from '../models/user';
import { wxLogin, wxLoginWithAuth, wxMiniProgramLogin } from '../controller/wx-login';

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

// 获取用户收藏的商品
router.get('/user/starCommodities', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getUserStarCommodities(username);
  ctx.body = res;
})

// 获取用户收藏的商品
router.get('/user/starShops', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getUserStarShops(username);
  ctx.body = res;
});

// 获取用户收藏的信息
router.get('/user/starInfo', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getUserStarInfo(username);
  ctx.body = res;
})

// 获取用户收藏的商品的详情信息
router.get('/user/starCommoditiesInfo', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getUserStarCommoditiesInfo(username);
  ctx.body = res;
})

// 获取用户收藏的商品的详情信息
router.get('/user/starShopsInfo', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getUserStarShopsInfo(username);
  ctx.body = res;
})

// 微信 H5 认证
router.post('/user/wx/h5/auth', async (ctx) => {
  const { code } = ctx.request.body;
  const res = await wxLoginWithAuth(code);
  ctx.body = res;
})

// 微信 H5 登录
router.post('/user/wx/h5/login', async (ctx) => {
  const { openId } = ctx.request.body;
  const res = await wxLogin(openId);
  ctx.body = res;
})

// 微信小程序登录
router.post('/user/wx/miniProgram/login', async (ctx) => {
  const { nickname, code } = ctx.request.body;
  const res = await wxMiniProgramLogin(code, nickname);
  ctx.body = res;
})

export default router;