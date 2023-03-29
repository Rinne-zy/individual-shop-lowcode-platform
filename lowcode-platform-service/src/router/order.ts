import KoaRouter from 'koa-router';
import { 
  cancelOrderByOrderId,
  createOrder,
  deliverOrderByOrderId,
  getOrderByCustomerUserName,
  getOrderByMerchantUserName,
  payOrderByOrderId,
  finishOrderByOrderId,
  getOrderTypeNumber,
} from '../controller/order';

// koa 路由实例
const router = new KoaRouter();

// 提交订单
router.post('/order/create', async (ctx) => {
  const { username } = ctx.state.userInfo;
  ctx.body = await createOrder(username);
})

// 获取顾客的订单数据
router.get('/order/customer/get',  async (ctx) => {
  const { username } = ctx.state.userInfo;
  ctx.body = await getOrderByCustomerUserName(username);
})

// 顾客支付
router.post('/order/customer/pay', async (ctx) => {
  const { ids } = ctx.request.body;
  const { username } = ctx.state.userInfo;
  ctx.body = await payOrderByOrderId(ids, username);
})

// 顾客获取
router.post('/order/customer/cancel', async (ctx) => {
  const { id } = ctx.request.body;
  const { username } = ctx.state.userInfo;
  ctx.body = await cancelOrderByOrderId(id, username);
})

// 商家获取的订单数据
router.get('/order/merchant/get',  async (ctx) => {
  const { username } = ctx.state.userInfo;
  ctx.body = await getOrderByMerchantUserName(username);
})

// 商家获取的订单数据
router.post('/order/merchant/deliver',  async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { id, trackingNumber } = ctx.request.body;
  ctx.body = await deliverOrderByOrderId(id, username, trackingNumber);
})

// 商家获取的订单数据
router.post('/order/customer/finish',  async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { id } = ctx.request.body;
  ctx.body = await finishOrderByOrderId(id, username);
})

// 商家获取的订单数据
router.get('/order/customer/typeNumber',  async (ctx) => {
  const { username } = ctx.state.userInfo;
  ctx.body = await getOrderTypeNumber(username);
})
export default router;