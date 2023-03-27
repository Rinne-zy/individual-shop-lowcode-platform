import { Schema, model } from "mongoose";

export enum OrderStatus {
  // 待支付
  Paying = 0,
  // 待发货
  Preparing = 1,
  // 发货中
  Delivering = 2,
  // 已完成
  Finished = 3
}

export interface ShopInOrder {
  // 商城 id
  _id: string;
  // 商城名称
  name: string;
  // 商城封面
  avatar: string;
  // 商城拥有者 id
  ownerId: string;
}

export interface CustomerInOrder {
  // 用户名
  username: string;
  // 地址
  address: string;
};

export interface CommodityInOrder {
  // 商品 id
  _id: string;
  // 商品名称
  name: string
  // 价格
  price: number;
  // 数量
  number: number;
  // 类型
  type: string;
  // 描述
  desc: string;
  // 封面
  cover: string;
}

export interface Order {
  // 商城信息
  shop: ShopInOrder;
  // 订单顾客信息
  customer: CustomerInOrder;
  // 订单的商品信息
  commodities: CommodityInOrder[];
  // 订单状态
  status: OrderStatus,
  // 订单创建时间
  created: number;
  // 订单的快递单号
  trackingNumber: string;
  // 总价格
  totalPrice: string;
}

// 图片信息 Schema
const orderSchema = new Schema<Order>({
  shop: Object,
  customer: Object,
  commodities: {
    type: [Object],
    default: undefined,
  },
  status: Number,
  created: Number,
  trackingNumber: String,
  totalPrice: Number,
});


export default model('order', orderSchema);