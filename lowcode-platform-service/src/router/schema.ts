import KoaRouter from 'koa-router';

import { StatusCode } from './../const/index';
import { getShopSchemaById } from '../controller/schema';

const router = new KoaRouter();

// 获取商城 schema 信息
router.get('/schema/get', async (ctx) => {
  const { schemaId } = ctx.query;
  const shopSchema = await getShopSchemaById(schemaId as string);

  ctx.body = {
    code: StatusCode.Success,
    msg: '获取成功',
    shopSchema: shopSchema,
  }
});

export default router;