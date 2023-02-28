import { defineStore } from 'pinia';

enum CommodityStatus {
  // 仓库中
  OnStore = 0,
	// 上架
  OnSale = 1,
  // 售罄
  SoldOut = 2,
}

interface Commodity {
  /* 基本信息 */
  // 商品 id
	id: string;
  // 商品名称
  name: string;
  // 商品封面
  coverSrc: string[];
  // 商品描述
  desc: string;
  // 商品分类（用于商品分类展示）
  type: string;
  // 商品状态
  status: CommodityStatus;
  
  /* 商品交易信息 */
  // 商品价格
  price: number;
  // 商品折扣
  discount: number;
  // 库存
  stock: string;
  // 运费
  freight: number;
  
  /* 其他信息 */
  // 销量
  sales: number;
  // 添加时间
  addTime: string;
}

interface CommodityManageStore {
  Commodities: Commodity[],

}

// 商品管理
export const commodityStore = defineStore('commodity', {
  state: (): CommodityManageStore => ({
    Commodities: [],
  }),
  actions: {

  }
})