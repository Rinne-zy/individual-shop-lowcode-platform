import KoaRouter from 'koa-router';
import { cancelOrderByOrderId, createOrder, getOrderByCustomerUserName, payOrderByOrderId } from '../controller/order';

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

router.post('/order/customer/pay', async (ctx) => {
  const { ids } = ctx.request.body;
  ctx.body = await payOrderByOrderId(ids);
})

router.post('/order/customer/cancel', async (ctx) => {
  const { id } = ctx.request.body;
  ctx.body = await cancelOrderByOrderId(id);
})
export default router;