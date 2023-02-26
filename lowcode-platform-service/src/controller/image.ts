import type { Files } from 'formidable';
import { deleteImage, getUserImagePath, saveImages } from '../utils/file';

import Image from './../models/image';
import { StatusCode } from "../const";

/**
 * 保存上传的图片
 * @param origin 服务器源
 * @param username 用户名
 * @param name 文件名
 * @param file 文件
 * @returns 
 */
export async function saveImage(origin: string, username: string, name: string, file: Files) {
  // 保存图片
  const userDir = `${username}/`;
  const fileName = await saveImages(userDir, file);

  // 获取相应静态资源的服务器路径
  const path = getUserImagePath(origin, userDir, fileName) as string;
  await Image.create({
    username,
    name,
    src: path,
    modified: Date.now(),
  })

  return {
    code: StatusCode.Success,
    msg: '上传成功',
  }
}

/**
 * 根据用户名获取上传的图片信息
 * @param username 用户名
 * @returns 该用户上传的图片信息
 */
export async function getImagesByUserName(username: string) {
  const images = await Image.find({
    username,
  }) 

  return {
    code: StatusCode.Success,
    images,
    msg: '获取成功',
  }
}

/**
 * 根据图片 id 删除图片
 * @param id 图片 id
 */
export async function deleteImageById(id: string) {
  // 删除图片记录
  const image = await Image.findByIdAndDelete(id);
  if(!image || !image.username || !image.src) return {
    code: StatusCode.Error,
    msg: '图片记录异常',
  }
  // 删除图片文件
  const { username, src } = image;
  await deleteImage(`/${username}${src.split(username)[1]}`);
  return {
    code: StatusCode.Success,
    msg: '删除成功',
  }
}

/**
 * 更新图片信息
 * @param id 图片 id 信息
 * @param name 图片名称
 * @param file 图片文件
 * @returns 
 */
export async function updateImage(id: string, name: string, file: Files | undefined) {
  // 只更新图片名称
  if(!file || !file.file) {
    await Image.findByIdAndUpdate(id, {
      name,
      modified: Date.now(),
    });
  } else {
    // 更新图片名称或者图片文件
    const image = await Image.findById(id);
    if(!image) {
      return {
        code: StatusCode.Error,
        msg: '数据库不存在该 id 信息',
      }
    }

    const { src, username } = image;
    const userDir = `${username}/`;
    const fileName = await saveImages(userDir, file);
    // 根据用户名分割原有的图片地址，前半部分为图片地址前缀，后半部分原来的图片名称
    const splittedSrc = src!.split(username as string);

    // 保存图片
    await Image.findByIdAndUpdate(id, {
      name,
      src: `${splittedSrc[0]}${username}/${fileName}`,
      modified: Date.now(),
    });
    // 删除图片
    await deleteImage(`/${username}${splittedSrc[1]}`);
  }

  return {
    code: StatusCode.Success,
    msg: '更新成功',
  }
}

/**
 * 根据图片 id 删除图片
 * @param id 图片 id
 */
export async function deleteImageByIds(ids: string[]) {

  // 记录错误删除错误的信息
  const errorMessage:string[] = [];
  // 并行删除图片
  const res = await Promise.all(ids.map((id) => new Promise<boolean>(async (resolve, reject) => {
    const image = await Image.findByIdAndDelete(id);
    if(!image || !image.username || !image.src) {
      errorMessage.push(id);
      reject(false);
      return;
    }

    // 删除图片文件
    const { username, src } = image;
    await deleteImage(`/${username}${src.split(username)[1]}`);
    resolve(true);
  })));

  if(res.some((isSuccessDelete) => !isSuccessDelete)) {
    return {
      code: StatusCode.Error,
      msg: `删除失败，所需删除的图片信息存在异常: '${errorMessage.join(',')}`,
    }
  }
  
  return {
    code: StatusCode.Success,
    msg: '删除成功',
  }
}