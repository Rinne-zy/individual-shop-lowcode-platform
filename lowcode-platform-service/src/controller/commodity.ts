import { Commodity as CommodityType } from './../models/commodity';
import Commodity  from './../models/commodity';
import { StatusCode } from '../const';

/**
 * 获取商品
 * @param username 用户名
 */
export async function getCommodities(username: string) {
  const commodities = await Commodity.find({
    username,
  });

  return {
    code: StatusCode.Success,
    commodities,
    msg: '获取成功',
  }
}

/**
 * 创建商品
 * @param commodity 商品
 * @returns 
 */
export async function createCommodity(username: string, commodity: CommodityType) {
  await Commodity.create({
    ...commodity,
    username,
    addTime: Date.now(),
  });

  return {
    code: StatusCode.Success,
    msg: '添加成功',
  }
}

/**
 * 更新商品
 * @param id 商品 id
 * @param commodity 商品属性
 * @returns 
 */
export async function updateCommodity(id: string, commodity: Partial<CommodityType>) {
  await Commodity.findByIdAndUpdate(id, {
    ...commodity
  })
  
  return {
    code: StatusCode.Success,
    msg: '更新成功',
  }
}

/**
 * 删除商品
 * @param id 商品 id(object_id)
 */
export async function deleteCommodity(id: string | string[]) {
  const ids: string[] = typeof id === 'string' ? [id] : id;
  await Promise.all(ids.map((id) => Commodity.findByIdAndDelete(id)));
  
  return {
    code: StatusCode.Success,
    msg: '删除成功',
  }
}

/**
 * 更新商品状态
 * @param id 商品 id
 * @param status 商品状态
 * @returns 
 */
export async function changeCommodityStatus(id: string, status: number) {
  await Commodity.findByIdAndUpdate(id, {
    status,
  })
  
  return {
    code: StatusCode.Success,
    msg: '更新状态成功',
  }
}

/**
 * 根据商品 id 获取商品
 * @param id 商品id
 * @returns 
 */
export async function getCommoditiesById(id: string | string[]) {
  const ids: string[] = typeof id === 'string' ? [id] : id;
  const commodities = await Promise.all(ids.map((id) => Commodity.findById(id)));
  return {
    code: StatusCode.Success,
    commodities,
    msg: '获取成功',
  }
}