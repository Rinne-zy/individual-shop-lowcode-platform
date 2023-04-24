import { getCommoditiesByIds } from "lowcode-platform/api/commodity";
import { StatusCode } from "lowcode-platform/api/type";
import { defineStore } from "pinia";

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
  // 商品详情
  detail: string;
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
  // 商品详情
  detail: string;
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
};

interface CommodityStore {
  commoditiesById: Record<string, Commodity>;
  
}

export const useCommodityStore = defineStore('commodity', {
  state:(): CommodityStore => ({
    commoditiesById: {},
  }),
  actions: {
    addCommodities(commodities: Commodity[]) {
      commodities.forEach((commodity) => {
        this.commoditiesById[commodity._id] = commodity || {};
      });
    },
    async getCommoditiesByIds(ids: string[]) {
      const existIds = Object.keys(this.commoditiesById);
      const notExistsCommodityIds = ids.filter((id: string) => !existIds.includes(id));
      // 获取当前 store 不存在的 id 的商品
      if(notExistsCommodityIds.length) {
        const { data } = await getCommoditiesByIds(notExistsCommodityIds);
        if (!data || data.code !== StatusCode.Success || !data.commodities) throw new Error(data.msg);
        this.addCommodities(data.commodities);
      }

      return ids.map((id) => this.commoditiesById[id]);
    }
  }
});