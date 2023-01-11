import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import type { Server } from 'http';

import userRouter from './router/user';
import router from './router';

// 创建服务对象
const app = new Koa();
app.use(bodyParser())
app.use(cors({
  origin: 'http://localhost:5173',
  maxAge: 5 * 60 * 1000, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
}))

// 引入用户路由
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

// 引入路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
const runServer = (port: number): Server => {
  console.log(`Server running on port ${port}`);
  return app.listen(port);
};

export default runServer;