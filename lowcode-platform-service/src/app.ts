import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import type { Server } from 'http';

import userRouter from './router/user';
import router from './router';

// 创建服务对象
const app = new Koa();
app.use(bodyParser())

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