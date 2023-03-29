import KoaRouter from 'koa-router';
import { 
  createShop,
  deleteShop,
  deployShop,
  getDeployShopById,
  getDevelopShopById,
  getShops,
  updateShopBasicInfo,
  updateShopSchema,
  starShop,
} from '../controller/shop';

const router = new KoaRouter();

// 创建商城
router.post('/shop/create', async (ctx) => {
  const { shopInfo, schema } = ctx.request.body;
  const { username } = ctx.state.userInfo;
  const res = await createShop(username, shopInfo, schema);
  ctx.body = res;
});

// 更新商城信息
router.post('/shop/update/info', async (ctx) => {
  const { shopId, shopInfo } = ctx.request.body;
  ctx.body = await updateShopBasicInfo(shopId, shopInfo);
})

// 更新商城 schema
router.post('/shop/update/schema', async (ctx) => {
  const { shopId, schema } = ctx.request.body;
  ctx.body = await updateShopSchema(shopId, schema);
})

// 部署商城 schema
router.post('/shop/deploy', async (ctx) => {
  const { shopId } = ctx.request.body;
  ctx.body = await deployShop(shopId);
});

// 获取商城基本信息
router.get('/shop/get/info', async (ctx) => {
  const { shopId } = ctx.query;
  ctx.body = await deployShop(shopId as string);
});

// 获取部署的商城信息
router.get('/shop/get/dep', async (ctx) => {
  const { shopId } = ctx.query;
  ctx.body = await getDeployShopById(shopId as string);
});

// 获取开发的商城信息
router.get('/shop/get/dev', async (ctx) => {
  const { shopId } = ctx.query;
  ctx.body = await getDevelopShopById(shopId as string);
})

// 获取商城信息
router.get('/shop/get', async (ctx) => {
  const { username } = ctx.state.userInfo;
  ctx.body = await getShops(username);
})

// 删除商城信息
router.post('/shop/delete', async (ctx) => {
  const { shopId } = ctx.request.body;
  ctx.body = await deleteShop(shopId);
});

// 删除商城信息
router.post('/shop/star', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { shopId } = ctx.request.body;
  ctx.body = await starShop(shopId, username);
});

export default router;