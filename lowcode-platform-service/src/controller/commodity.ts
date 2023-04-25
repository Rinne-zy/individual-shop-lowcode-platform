import commodity, { CommodityStatus, Commodity as CommodityType } from './../models/commodity';
import Shop from '../models/shop';
import Commodity  from './../models/commodity';
import User from './../models/user';
import Type from '../models/type';
import { StatusCode } from '../const';
import { getCommoditiesFromShop } from './shop';
import { getLabelsByType } from '../utils/label';

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
export async function starCommodity(username: string, commodityId: string, shopId: string) {
  const user = await User.findOne({ username });
  if(!user) throw new Error('用户名不存在');

  let isStar = false;

  if(!user.starCommodities) {
    user.starCommodities = {};
  };

  const id = `${commodityId}-${shopId}`;

  // 若已收藏则取消收藏
  if(user.starCommodities[id]) {
    delete user.starCommodities[id];
  } else {
    isStar = true;
    user.starCommodities[id] = true;
  }

  user.markModified('starCommodities');
  await user.save();

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    status: isStar,
  }
};

/**
 * 从收藏的商品中获取有效的商品信息
 * @param starCommoditiesInfo 收藏的商品信息
 * @param needDetail 是否需要商品详细信息
 * @returns 
 */
export async function getValidCommoditiesFromStarCommodities(starCommoditiesInfo: Record<string, boolean>, needDetail = false) {
  const starCommodityIds: string[] = [];
  // 获取收藏的商品的 id
  Object.keys(starCommoditiesInfo).forEach((id) => {
    if(starCommoditiesInfo[id]) {
      starCommodityIds.push(id);
    }
  });

  const commodities = await Promise.all(starCommodityIds.map(async (id) => {
    try {
      const [commodityId, shopId] = id.split('-');
      const commoditiesInShop = await getCommoditiesFromShop(shopId);
      // 获取当前部署的商城中是否还存在该商品
      if(commoditiesInShop.findIndex((id) => id === commodityId) === -1) return null;
      // 不需要详细信息只返回 id
      if(!needDetail) return id;

      const commodity = await Commodity.findById(commodityId);
      if(!commodity) return null;

      const { _id, name, imagesSrc, desc, status } = commodity;
      return {
        id: _id,
        name,
        cover: imagesSrc[0],
        desc,
        shopId: shopId,
        status
      }
      
    } catch(err) {
      return null
    }
  }));

  return commodities.filter((commodity) => commodity);
}

/**
 * 根据分类获取最热的商品信息
 * @param username 用户名
 * @param type 分类
 * @param number 数量
 * @returns 
 */
export async function getHotCommoditiesByType(
  shopId: string | undefined,
  username: string | undefined,
  type: string | undefined,
  number: number
) {
  if(shopId) {
    const shop = await Shop.findById(shopId);
    username = shop?.username;
  }

  let commodities = await Commodity.find({
    username,
    status: CommodityStatus.OnSale
  });

  if(type !== undefined) {
    commodities = commodities.filter((commodity) => commodity.type === type);
  };

  commodities = commodities.sort((c1, c2) => c2.sales - c1.sales).slice(0, number);

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    commodities,
  }
}

/**
 * 根据分类获取最新的商品信息
 * @param username 用户名
 * @param type 分类
 * @param number 数量
 * @returns 
 */
export async function getNewCommoditiesByType(
  shopId: string | undefined, 
  username: string | undefined, 
  type: string | undefined,
  number: number
) {
  if(shopId) {
    const shop = await Shop.findById(shopId);
    username = shop?.username;
  }
  
  let commodities = await Commodity.find({
    username,
    status: CommodityStatus.OnSale,
  });

  if(type !== undefined) {
    commodities = commodities.filter((commodity) => commodity.type === type);
  };

  commodities = commodities.sort((c1, c2) => c2.addTime - c1.addTime).slice(0, number);

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    commodities,
  }
}

/**
 * 获取按照商品分类分组的商品
 * @param username 
 * @returns 
 */
export async function getCommoditiesSortByType(username: string) {
  const commoditiesByType: Record<string, {
    label: string
    options: { value: string, label: string }[]
  }> = {};

  const [commodities, types] = await Promise.all([
    Commodity.find({ username,}),
    Type.findOne({
      username,
      name: 'commodity',
    })
  ]);

  if(!types || !commodities) return {
    code: StatusCode.Success,
    msg: '获取成功',
    options: [],
  };

  const labelByType = getLabelsByType(types.options);
  commodities.forEach((commodity) => {
    const { _id, name, type } = commodity;
    if(!commoditiesByType[type]) {
      commoditiesByType[type] = {
        label: labelByType[type],
        options: [],
      }
    }

    commoditiesByType[type].options.push({
      label: name,
      value: _id.toString(),
    })
  });

  const options = Array.from(Object.values(commoditiesByType));

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    options,
  };
}