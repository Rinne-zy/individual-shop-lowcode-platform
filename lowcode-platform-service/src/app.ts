import Koa from 'koa';
import type { Server } from 'http';

import router from './router';

// 创建服务对象
const app = new Koa();

// 引入路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
const runServer = (port: number): Server => {
  console.log(`Server running on port ${port}`);
  return app.listen(port);
};

export default runServer;