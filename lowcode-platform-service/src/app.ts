import Koa from 'koa';
import koaBody from 'koa-body';
import cors from 'koa2-cors';
import koaStatic from 'koa-static';
import path from 'path';
import type { Server } from 'http';

import orderRouter from './router/order';
import schemaRouter from './router/schema';
import shopRouter from './router/shop'
import shoppingCartRouter from './router/shopping-cart';
import addressRouter from './router/address';
import userRouter from './router/user';
import fileRouter from './router/file';
import typeRouter from './router/type';
import CommodityRouter from './router/commodity';
import router from './router';
import catchError from './middlewares/catch-error';
import verifyToken from './middlewares/verify-token';

// 创建服务对象
const app = new Koa();
// 跨域
app.use(cors({
  origin: '*',
  maxAge: 5 * 60 * 1000, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
// koa-body 处理
app.use(koaBody({
  multipart: true,
  formidable: {
    // 保留文件扩展名
    keepExtensions: true,
}}));
// koa 静态资源
app.use(koaStatic(path.join(process.cwd(), 'public')));

// 统一的错误处理逻辑中间件
app.use(catchError);
app.use(verifyToken);

// 引入用户路由
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

// 用户信息相关路由
app.use(router.routes());
app.use(router.allowedMethods());

// 文件相关路由
app.use(fileRouter.routes());
app.use(fileRouter.allowedMethods());

// 类型相关路由
app.use(typeRouter.routes());
app.use(typeRouter.allowedMethods());

// 商品相关路由
app.use(CommodityRouter.routes());
app.use(CommodityRouter.allowedMethods());

// 地址信息相关路由
app.use(addressRouter.routes());
app.use(addressRouter.allowedMethods());

// 购物车相关路由
app.use(shoppingCartRouter.routes());
app.use(shoppingCartRouter.allowedMethods());

// 商城相关路由
app.use(shopRouter.routes());
app.use(shopRouter.allowedMethods());

// schema 相关路由
app.use(schemaRouter.routes());
app.use(schemaRouter.allowedMethods());

// 订单相关路由
app.use(orderRouter.routes());
app.use(orderRouter.allowedMethods());

// 启动服务
const runServer = (port: number): Server => {
  console.log(`Server running on port ${port}`);
  return app.listen(port);
};

export default runServer;