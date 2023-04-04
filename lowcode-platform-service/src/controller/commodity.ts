import { Commodity as CommodityType } from './../models/commodity';
import Shop from '../models/shop';
import Commodity  from './../models/commodity';
import User from './../models/user';
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

/**
 * 获取商品详情页信息
 * @param shopId 商城 id
 * @param commodityId 商品 id 
 * @returns 
 */
export async function getCommodityDetail(shopId: string, commodityId: string) {
 const [shop, commodity] =  await Promise.all([
    Shop.findById(shopId),
    Commodity.findById(commodityId),
  ]);

  if(!commodity) throw new Error('商品不存在');
  if(!shop) throw new Error('当前商场不存在该商品');

  const data = {
    shop: {
      id: shop._id,
      name: shop.name,
      avatar: shop.avatar,
      starNum: shop.starNum,
    },
    commodity
  }

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    data,
  }
}

/**
 * 收藏商品
 * @param username 用户名
 * @param commodityId 商品 id
 */
export async function starCommodity(username: string, commodityId: string) {
  const user = await User.findOne({ username });
  if(!user) throw new Error('用户名不存在');

  let isStar = false;

  if(!user.starCommodities) {
    user.starCommodities = {};
  };

  // 若已收藏则取消收藏
  if(user.starCommodities[commodityId]) {
    delete user.starCommodities[commodityId];
  } else {
    isStar = true;
    user.starCommodities[commodityId] = true;
  }

  user.markModified('starCommodities');
  await user.save();

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    status: isStar,
  }
};