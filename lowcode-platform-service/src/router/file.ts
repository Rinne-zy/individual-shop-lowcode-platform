import KoaRouter from 'koa-router';
import type { File } from 'formidable';
import { getImagesByUserName, saveImage } from '../controller/image';

const router = new KoaRouter();

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

router.get('/image/get', async (ctx) => {
  const { username } = ctx.state.userInfo;
  const res = await getImagesByUserName(username);
  ctx.body = res;
})

export default router;