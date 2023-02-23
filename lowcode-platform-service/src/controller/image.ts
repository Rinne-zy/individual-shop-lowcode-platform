import type { Files } from 'formidable';
import { getUserImagePath, saveImages } from '../utils/file';

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
    src: path
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