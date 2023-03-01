import Image from './../models/image';
import { StatusCode } from "../const";
import type { CascaderPanelOption } from "../models/type";
import Type from '../models/type';
import { updateImage } from './image';
import { getTypeLabels } from '../utils/label';

/**
 * 新建类型
 * @param username 
 * @param name 
 * @param options 
 * @returns 
 */
export async function createType(username: string, name: string, options: CascaderPanelOption[]) {
  const newOptions = await Type.create({
    username,
    name,
    options,
  });
  
  return newOptions;
}

/**
 * 更新类型
 * @param id 类型 id
 * @param newOptions 新的类型选项
 * @returns 
 */
export async function updateType(id: string, newOptions: CascaderPanelOption[]) {
  await Type.findByIdAndUpdate(id, {
    options: newOptions,
  })
  
  return {
    code: StatusCode.Success,
    msg: '操作成功',
  }
}

/**
 * 删除图片类型
 * @param id 
 * @param deleted 
 * @param newOptions 
 * @returns 
 */
export async function deleteImageType(id: string, deletedType: string, newOptions: CascaderPanelOption[]) {
  await Type.findByIdAndUpdate(id, {
    options: newOptions,
  });

  // 获取类型为已删除类型的图片并重置
  const images = await Image.find({
    type: deletedType
  });
  if(images && images.length) {
    // 将图片类型重置为未分组
    await Promise.all(images.map((image) => updateImage(image.id, image.name as string, 'default', undefined)));
  }

  return {
    code: StatusCode.Success,
    msg: '操作成功',
  }
}

/**
 * 获取类型以及其对应的标签名
 * @param username 用户名
 * @param name 类型名
 * @returns 
 */
export async function getTypesAndLabels(username: string, name: string) {
  let res = await Type.findOne({
    username,
    name,
  });

  // 若未创建过则新建一个该分类
  if(!res || !res.options.length) {
    res = await createType(username, name, [{
      label: '未分组',
      value: 'default',
      children: [],
    }]);
  }

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    id: res._id,
    labels: getTypeLabels(res.options),
    options: res.options,
   }
}