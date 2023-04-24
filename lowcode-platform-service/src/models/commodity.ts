import { Schema, model } from "mongoose";

export enum CommodityStatus {
  // 仓库中
  OnStore = 0,
	// 上架
  OnSale = 1,
  // 售罄
  SoldOut = 2,
};

// 商品
export interface Commodity {
  username: string,
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

// 商品 Schema
const commoditySchema = new Schema<Commodity>({
  username: String,
  name: String,
  imagesSrc: Array,
  desc: String,
  type: String,
  status: Number,
  detail: String,
  price: Number, 
  discount: Number, 
  stock: Number,
  freight: Number,
  sales: Number,
  addTime: Number,
});

export default model('commodity', commoditySchema);
