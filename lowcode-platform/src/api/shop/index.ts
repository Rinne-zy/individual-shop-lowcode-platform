import axios from 'axios';
import type { Schema } from 'lowcode-platform/store/schema-store';
import type { BaseResp } from '../type';

export interface Shop {
  // 商城 id
  _id: string;
  // 用户名
  username: string;
  // 商城名称
  name: string;
  // 商城头像
  avatar: string;
  // 商城的 schema
  devSchemaId: string;
  // 开发版本号
  devVersion:  number;
  // 发布版本号
  depVersion:  number;
  // 开发版最近修改时间
  devModified: number;
  // 发布版最近修改时间
  depModified: number;
};

export interface ShopsResp extends BaseResp {
  shops: Shop[],
};

export interface CreateShopResp extends BaseResp {
  _id: string,
};

export interface ShopInfo {
  // 商城名称
  name: string;
  // 商城头像
  avatar: string;
}

/**
 * 获取商城
 * @returns 
 */
export async function getShops() {
  const res = await axios<ShopsResp>({
    method: 'get',
    url: `shop/get`,
  });

  return res;
}

/**
 * 创建商城
 * @param shopInfo 商城信息
 * @param schema 商城 schema
 * @returns 
 */
export async function createShop(shopInfo: ShopInfo, schema: Schema | undefined) {
  const res = await axios<CreateShopResp>({
    method: 'post',
    url: `shop/create`,
    data: {
      shopInfo,
      schema,
    }
  });

  return res;
}

/**
 * 更新商城基础信息
 * @param shopId 商城id
 * @param shopInfo 商城信息
 * @returns 
 */
export async function updateShopBasicInfo(shopId: string, shopInfo: ShopInfo,) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: `shop/update/info`,
    data: {
      shopInfo,
      shopId,
    }
  });

  return res;
}

/**
 * 更新商城 schema
 * @param shopId 商城id
 * @returns 
 */
export async function updateShopSchema(shopId: string, schema: Schema) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: `shop/update/schema`,
    data: {
      schema,
      shopId,
    }
  });

  return res;
};

/**
 * 更新商城 schema
 * @param shopId 商城id
 * @returns 
 */
export async function deleteShop(shopId: string) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: `shop/delete`,
    data: {
      shopId,
    }
  });

  return res;
};

export async function deployShop(shopId: string) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: `shop/deploy`,
    data: {
      shopId,
    }
  });

  return res;
}