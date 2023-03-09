import KoaRouter from 'koa-router';
import { createSchema, getByUsername, getSchemaById, updatedSchemaById } from '../controller/schema';

const router = new KoaRouter();

// 创建 schema
router.post('/schema/create', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const { schema, name } = ctx.request.body;

  const res = await createSchema(username, name, schema);
  ctx.body = res;
});

// 获取该用户下的所有商城 schema
router.get('/schema/get', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getByUsername(username);
  ctx.body = res;
})

// 更新特定商城 id 的商城信息
router.post('/schema/updateById', async (ctx) => {
  const { id, name, schema } = ctx.request.body;
  const res = await updatedSchemaById(id, name, schema);
  ctx.body = res;
})

// 获取该用户下的所有商城 schema
router.get('/schema/getById', async (ctx) => {
  const { id } = ctx.query;
  const res = await getSchemaById(id as string);
  ctx.body = res;
})

export default router;