import KoaRouter from 'koa-router';
import { verifyToken } from '../utils/jwt';

// koa 路由实例
const router = new KoaRouter();

router.get('/test', async (ctx) => {
  ctx.body = '测试 koa';
})

export default router;