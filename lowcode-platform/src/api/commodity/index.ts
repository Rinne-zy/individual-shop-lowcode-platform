import axios from "axios";

import { BaseResp } from "../type";

// 商品状态
export enum CommodityStatus {
  // 仓库中
  OnStore = 0,
	// 上架
  OnSale = 1,
  // 售罄
  SoldOut = 2,
}

// 商品表单
export interface CommodityForm {
  // 商品 id
  _id?: string;
  // 商品名称
  name: string;
  // 商品封面
  imagesSrc: { id: number, src: string}[];
  // 商品描述
  desc: string;
  // 商品分类（用于商品分类展示）
  type: string;
  // 商品状态
  status: CommodityStatus;
  // 商品价格
  price: number;
  // 商品折扣
  discount: number;
  // 库存
  stock: number;
  // 运费
  freight: number;
  // 销量
  sales: number;
  // 添加时间
  addTime: number;
}

// 商品分类
export interface Commodity {
  // 商品 id
	_id: string;
  // 商品名称
  name: string;
  // 商品封面
  imagesSrc: string[];
  // 商品描述
  desc: string;
  // 商品分类（用于商品分类展示）
  type: string;
  // 商品状态
  status: CommodityStatus;
  // 商品价格
  price: number;
  // 商品折扣
  discount: number;
  // 库存
  stock: number;
  // 运费
  freight: number;
  // 销量
  sales: number;
  // 添加时间
  addTime: number;
}

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