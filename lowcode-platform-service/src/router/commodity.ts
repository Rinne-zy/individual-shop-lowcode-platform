import KoaRouter from 'koa-router';
import { changeCommodityStatus, createCommodity, deleteCommodity, getCommodities, getCommoditiesById, getCommoditiesSortByType, getCommodityDetail, getHotCommoditiesByType, getNewCommoditiesByType, updateCommodity } from '../controller/commodity';
import { starCommodity } from '../controller/commodity';

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

// 根据 id 获取商品信息
router.post('/commodity/getByIds', async (ctx) => {
  const { ids } = ctx.request.body;
  const res = await getCommoditiesById(ids);

  ctx.body = res;
});

// 获取商品详情页信息
router.get('/commodity/getDetail', async (ctx) => {
  const { shopId, commodityId } = ctx.query;
  const res = await getCommodityDetail(shopId as string, commodityId as string);
  ctx.body = res;
});

// 收藏商品
router.post('/commodity/star', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { commodityId, shopId } = ctx.request.body;
  const res = await starCommodity(username, commodityId, shopId);
  ctx.body = res;
});

// 获取最新商品
router.post('/commodity/new', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { type, number } = ctx.request.body;
  const res = await getNewCommoditiesByType(undefined, username, type, number);
  ctx.body = res;
})

// 获取最热商品
router.post('/commodity/hot', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { type, number } = ctx.request.body;
  const res = await getHotCommoditiesByType(undefined, username, type, number);
  ctx.body = res;
})

// 非登录获取最新商品
router.post('/commodity/nl/new', async (ctx) => {
  const { type, number, shopId } = ctx.request.body;
  const res = await getNewCommoditiesByType(shopId, undefined, type, number);
  ctx.body = res;
})

// 非登录状态获取最热商品
router.post('/commodity/nl/hot', async (ctx) => {
  const { type, number, shopId } = ctx.request.body;
  const res = await getHotCommoditiesByType(shopId, undefined, type, number);
  ctx.body = res;
})

// 获取按照商品分类分组的商品
router.get('/commodity/sort/type', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getCommoditiesSortByType(username);
  ctx.body = res;
})

export default router;