import KoaRouter from 'koa-router';
import { deleteCommodityType, deleteImageType, getCommoditiesTypeAndLabel, getTypesAndLabels, updateType } from '../controller/type';

// koa 路由实例
const router = new KoaRouter();

// 获取类型
router.get('/type/image/get', async (ctx) => {
  const { username } = ctx.state.userInfo;

  const res = await getTypesAndLabels(username, 'image');
  ctx.body = res;
});

// 获取类型
router.get('/type/commodity/get', async (ctx) => {
  const { username } = ctx.state.userInfo;

  const res = await getTypesAndLabels(username, 'commodity');
  ctx.body = res;
});

// 更新类型
router.post('/type/update', async (ctx) => {
  const { id, options } = ctx.request.body;
  const res = await updateType(id, options);
  ctx.body = res;
});

// 删除图片分类类型
router.post('/type/image/delete', async (ctx) => {
  const { id, options, type } = ctx.request.body;
  const res = await deleteImageType(id, type, options);
  ctx.body = res;
});

// 删除商品分类类型
router.post('/type/commodity/delete', async (ctx) => {
  const { id, options, type } = ctx.request.body;
  const res = await deleteCommodityType(id, type, options);
  ctx.body = res;
});

// 获取可被选择的商品分类
router.get('/type/commodity/select', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getCommoditiesTypeAndLabel(username);
  ctx.body = res;
})

export default router;