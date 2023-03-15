import KoaRouter from 'koa-router';
import { addNewAddress, deleteAddress, getAddress, getSelectedAddress, selectAddress, updateAddress } from '../controller/address';

// koa 路由实例
const router = new KoaRouter();

// 获取所有地址信息
router.get('/address/get', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getAddress(username);
  ctx.body = res;
});

// 添加地址
router.post('/address/add',  async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { address } = ctx.request.body;
  const res = await addNewAddress(username, address, address.isDefault);
  ctx.body = res;
});

// 更新地址
router.post('/address/update',  async (ctx) => {
  const { address, _id } = ctx.request.body;
  const res = await updateAddress(_id , address, address.isDefault);
  ctx.body = res;
});

// 删除地址
router.post('/address/delete',  async (ctx) => {
  const { addressInfoId, _id } = ctx.request.body;
  const res = await deleteAddress(_id, addressInfoId);
  ctx.body = res;
});

// 选择地址
router.post('/address/select',  async (ctx) => {
  const { addressInfoId, _id } = ctx.request.body;
  const res = await selectAddress(_id, addressInfoId);
  ctx.body = res;
});

// 获取选中的地址信息
router.get('/address/getSelectedAddress',  async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getSelectedAddress(username);
  ctx.body = res;
});

export default router;