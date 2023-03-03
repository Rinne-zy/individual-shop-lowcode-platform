import KoaRouter from 'koa-router';
import { changeCommodityStatus, createCommodity, deleteCommodity, getCommodities, updateCommodity } from '../controller/commodity';

// koa 路由实例
const router = new KoaRouter();

// 创建新商品
router.post('/commodity/add', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { commodity } = ctx.request.body;
  const res = await createCommodity(username, commodity);

  ctx.body = res;
});

// 更新商品
router.post('/commodity/update', async (ctx) => {
  const { id, commodity } = ctx.request.body;
  const res = await updateCommodity(id, commodity);

  ctx.body = res;
});

// 删除商品
router.post('/commodity/delete', async (ctx) => {
  const { ids } = ctx.request.body;
  const res = await deleteCommodity(ids);

  ctx.body = res;
});

// 获取商品
router.get('/commodity/get', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getCommodities(username);

  ctx.body = res;
});

// 上架商品
router.post('/commodity/onShelves', async (ctx) => {
  const { id } = ctx.request.body;
  const res = await changeCommodityStatus(id, 1);
  ctx.body = res;
});

// 下架商品
router.post('/commodity/offShelves', async (ctx) => {
  const { id } = ctx.request.body;
  const res = await changeCommodityStatus(id, 0);
  ctx.body = res;
});

export default router;