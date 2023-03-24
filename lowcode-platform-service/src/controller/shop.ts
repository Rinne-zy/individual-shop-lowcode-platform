import type { Document, Types } from 'mongoose';

import { SchemaType, ShopSchema } from './../models/schema';
import { StatusCode } from './../const/index';
import  Shop from './../models/shop';
import { createShopSchema, deleteShopSchemaById, getShopSchemaById, updateShopSchemaById } from './schema';
import type { ComponentSchema } from './../models/schema';

export interface ShopInfo {
  // 商城名称
  name: string;
  // 商城头像
  avatar: string;
}

/**
 * 创建商城
 * @param shopInfo 商城相关信息
 * @param schema 商城 schema
 * @returns 
 */
export async function createShop(username: string, shopInfo: ShopInfo, schema: ComponentSchema) {
  const shopSchema = await createShopSchema(schema);
  const { name, avatar } = shopInfo;
  const shop = await Shop.create({
    username,
    name,
    avatar,
    deployId: '',
    developedId: shopSchema._id,
  });

  return {
    code: StatusCode.Success,
    msg: '创建成功',
    shop,
  }
};

/**
 * 更新商城基本信息
 * @param shopId 商城 id
 * @param shopInfo 商城基本信息
 * @returns 
 */
export async function updateShopBasicInfo(shopId: string, shopInfo: ShopInfo) {
  const { name, avatar } = shopInfo;
  await Shop.findByIdAndUpdate(shopId, {
    name,
    avatar
  });

  return {
    code: StatusCode.Success,
    msg: '更新成功'
  }
};

/**
 * 更新商城信息
 * @param shopId 商城 id
 * @param type 商城类型
 * @param schema 商城 schema
 * @returns 
 */
export async function updateShopSchema(shopId: string, schema: ComponentSchema, type = SchemaType.Develop) {
  const shop = await Shop.findById(shopId);
  if(!shop) throw new Error('商城不存在');

  const id = type === SchemaType.Deploy ? shop.deployId : shop.developedId;
  await updateShopSchemaById(id, schema);

  return {
    code: StatusCode.Success,
    msg: '更新成功'
  }
};

/**
 * 部署商城信息
 * @param shopId 商城信息
 * @returns 
 */
export async function deployShop(shopId: string) {
  const shop = await Shop.findById(shopId);
  if(!shop) throw new Error('商城不存在');

  const devSchema = await getShopSchemaById(shop.developedId);
  if(!devSchema) throw new Error('不存在可部署的商城');

  let schema: Document<unknown, any, ShopSchema> & ShopSchema & {
    _id: Types.ObjectId;
  } | null;

  if(!shop.deployId) {
    schema = await createShopSchema(devSchema.schema, SchemaType.Deploy);
  } else {
    schema = await updateShopSchemaById(shop.deployId, devSchema.schema, SchemaType.Deploy);
  }

  if(!schema) throw new Error('部署失败');

  await Shop.findByIdAndUpdate(shopId, {
    deployId: schema._id
  })
  
  return {
    code: StatusCode.Success,
    msg: '部署成功'
  }
};

/**
 * 获取该用户下创建的商城信息
 * @param username 用户名
 * @returns 
 */
export async function getShops(username: string) {
  const shops = await Shop.find({ username });
  const shopsInfo = await Promise.all(
    shops.map(async (shop) => {
      const [ devSchema, depSchema ] = await Promise.all([
        getShopSchemaById(shop.developedId),
        shop.deployId ? getShopSchemaById(shop.deployId, false) : null,
      ]);
  
      if(!devSchema) throw new Error('获取 schema 失败');
  
      const { _id, name, username, avatar } = shop;

      return {
        _id,
        name,
        username,
        avatar,
        devSchemaId: shop.developedId,
        devVersion: devSchema.version,
        depVersion: depSchema?.version || null,
        devModified: devSchema.modified,
        depModified: depSchema?.modified || null
      }
   }));

   return {
    code: StatusCode.Success,
    msg: '获取成功',
    shops: shopsInfo,
   }
};

/**
 * 获取开发中的商城信息
 * @param shopId 
 * @returns 
 */
export async function getDevelopShopById(shopId: string) {
  const shop = await Shop.findById(shopId);
  if(!shop) throw new Error('商城不存在');

  const schema = await getShopSchemaById(shop.developedId);
  if(!schema) throw new Error('商城组件信息错误');

  const { _id, name, username, avatar } = shop;

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    shop: {
      _id,
      name,
      username,
      avatar,
      schema: schema.schema,
      depVersion: schema.version,
      depModified: schema.modified,
    }
  }
};

/**
 * 获取部署的商城信息
 * @param shopId 
 * @returns 
 */
export async function getDeployShopById(shopId: string) {
  const shop = await Shop.findById(shopId);
  if(!shop) throw new Error('商城不存在');

  const schema = await getShopSchemaById(shop.deployId);
  if(!schema) throw new Error('商城未部署');

  const { _id, name, username, avatar } = shop;

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    shop: {
        _id,
        name,
        username,
        avatar,
        schema: schema.schema,
        commodities: schema.commodities || [],
        depVersion: schema.version,
        depModified: schema.modified,
    }
  }
};

/**
 * 获取商城的基本信息
 * @param shopId 商城 id
 * @returns 
 */
export async function getShopBasicInfo(shopId: string) {
  const shop = await Shop.findById(shopId);
  if(!shop) throw new Error('商城不存在');
  const { _id, name, username, avatar } = shop;

  return {
    _id,
    name,
    username,
    avatar,
  }
}


/**
 * 删除商城
 * @param shopId 商城 id
 * @returns 
 */
export async function deleteShop(shopId: string) {
  const shop = await Shop.findById(shopId);
  if(!shop) throw new Error('商城不存在');
  const devId = shop.developedId;
  const depId = shop.deployId;
  await Promise.all([
    deleteShopSchemaById(devId),
    depId ? deleteShopSchemaById(depId) : null,
    Shop.findByIdAndDelete(shopId),
  ]);

  return {
    code: StatusCode.Success,
    msg: '删除成功',
   }
}

/**
 * 获取商城中的商品
 * @param shopId 商城 id
 * @returns 
 */
export async function getCommoditiesFromShop(shopId: string) {
  const shop = await Shop.findById(shopId);
  if(!shop) throw new Error('商城不存在');
  const schema = await getShopSchemaById(shop.deployId, false);
  if(!schema) throw new Error('商城未部署');

  return schema.commodities;
}