import axios from "axios";

import type { Commodity } from "lowcode-platform/store/commodity-store";
import type { BaseResp } from "../type";
import type { OptionsTypeForCommodities } from "../type/index";


export interface CommodityResp extends BaseResp {
  commodities: Commodity[];
}

/** 获取商品类型 */
export async function getCommodities() {
  const res = await axios<CommodityResp>({
    method: 'get',
    url: '/commodity/get',
  });

  return res;
}

/** 添加商品类型 */
export async function addCommodity(commodity: Partial<Commodity>) {
  const res = await axios<CommodityResp>({
    method: 'post',
    url: '/commodity/add',
    data: {
      commodity,
    }
  });

  return res;
}

/** 更新商品 */
export async function updateCommodity(id: string, commodity: Partial<Commodity>) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/commodity/update',
    data: {
      id,
      commodity
    }
  });

  return res;
}

/** 删除商品 */
export async function deleteCommodity(ids: string | string[]) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/commodity/delete',
    data: {
      ids,
    }
  });

  return res;
}

/**
 * 商品上架
 * @param id 商品 id
 * @returns 
 */
export async function putCommodityOnShelves(id: string) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/commodity/onShelves',
    data: {
      id,
    }
  });

  return res;
}

/**
 * 商品下架
 * @param id 商品 id
 * @returns 
 */
export async function putCommodityOffShelves(id: string) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/commodity/offShelves',
    data: {
      id,
    }
  });

  return res;
}

/**
 * 根据 id 获取商品
 * @param ids 商品 _id
 * @returns 
 */
export async function getCommoditiesByIds(ids: string[]) {
  const res = await axios<CommodityResp>({
    method: 'post',
    url: '/commodity/getByIds',
    data: {
      ids,
    }
  });

  return res;
}

/**
 * 根据 id 获取商品
 * @param ids 商品 _id
 * @returns 
 */
export async function getCommoditiesByType(type: string | undefined, number: number, sort: 'hot' | 'new') {
  const res = await axios<CommodityResp>({
    method: 'post',
    url: `/commodity/${sort}`,
    data: {
      type,
      number,
    }
  });

  return res;
}

/**
 * 根据 id 获取商品
 * @param ids 商品 _id
 * @returns 
 */
export async function getCommoditiesSortByType() {
  const res = await axios<OptionsTypeForCommodities>({
    method: 'get',
    url: `/commodity/sort/type`
  });

  return res;
}