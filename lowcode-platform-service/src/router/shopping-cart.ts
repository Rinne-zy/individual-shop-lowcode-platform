import KoaRouter from 'koa-router';
import { 
  handleChangeCartCommodityNum,
  addShoppingCartInfo,
  getShoppingCartInfo,
  handleSelectCartCommodity,
  handleSelectCartShopAllCommodities,
  deleteCommodityFromCart
} from '../controller/shopping-cart';

// koa 路由实例
const router = new KoaRouter();

// 添加至购物车
router.post('/shoppingCart/add', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { shopId, commodityId } = ctx.request.body;
  const res = await addShoppingCartInfo(username, shopId, commodityId);
  ctx.body = res;
});

// 获取相应的购物车信息
router.get('/shoppingCart/get', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getShoppingCartInfo(username);
  ctx.body = res;
});

// 增加商品数目
router.post('/shoppingCart/addCommodityNum', async (ctx) => {
  const { cartId, shopId, commodityId } = ctx.request.body;
  const res = await handleChangeCartCommodityNum(cartId, shopId, commodityId);
  res.msg = `添加${res.msg}`;
  ctx.body = res;
});

// 减少商品数目
router.post('/shoppingCart/reduceCommodityNum', async (ctx) => {
  const { cartId, shopId, commodityId } = ctx.request.body;
  const res = await handleChangeCartCommodityNum(cartId, shopId, commodityId, -1);
  res.msg = `减少${res.msg}`;
  ctx.body = res;
});

// 选择商品
router.post('/shoppingCart/selectCommodity', async (ctx) => {
  const { cartId, shopId, commodityId } = ctx.request.body;
  const res = await handleSelectCartCommodity(cartId, shopId, commodityId);
  ctx.body = res;
});

// 选择购物车商城中的所有商品
router.post('/shoppingCart/selectShopAllCommodities', async (ctx) => {
  const { cartId, shopId } = ctx.request.body;
  const res = await handleSelectCartShopAllCommodities(cartId, shopId);
  ctx.body = res;
});

// 从购物车中删除商品
router.post('/shoppingCart/deleteCommodity', async (ctx) => {
  const { cartId, shopId, commodityId } = ctx.request.body;
  const res = await deleteCommodityFromCart(cartId, shopId, commodityId);
  ctx.body = res;
});

export default router;
