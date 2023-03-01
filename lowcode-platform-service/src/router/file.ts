import KoaRouter from 'koa-router';
import type { File } from 'formidable';
import { deleteImageById, deleteImageByIds, getImagesByUserName, saveImage, updateImage } from '../controller/image';

const router = new KoaRouter();

// 上传图片
router.post('/image/upload', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const files = ctx.request.files;

  if(!files) throw new Error('上传图片错误');
  if(Array.isArray(files)) throw new Error('此接口仅支持上传单图片');

  // 文件名
  const name = ctx.request.body.name || (files.file as File).originalFilename;

  const res = await saveImage(ctx.origin, username, name, files);
  ctx.body = res;
});

// 获取图片
router.get('/image/get', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getImagesByUserName(username);
  ctx.body = res;
})

// 删除图片
router.post('/image/delete', async (ctx) => {
  const { id } = ctx.request.body;
  const res = await deleteImageById(id);
  ctx.body = res;
})

// 删除图片
router.post('/image/update', async (ctx) => {
  const files = ctx.request.files;
  const { name, id, type } = ctx.request.body;

  const res = await updateImage(id, name, type, files);
  ctx.body = res;
})

// 删除多个图片
router.post('/image/deleteMany', async (ctx) => {
  const { ids } = ctx.request.body;
  const res = await deleteImageByIds(ids);
  ctx.body = res;
})

export default router;