import { Schema, model } from "mongoose";

// 商城信息
export interface Shop {
  // 用户名
  username: string
  // 商城名称
  name: string;
  // 商城头像
  avatar: string;
  // 开发的 schema Id
  developedId: string;
  // 部署的 schema Id
  deployId: string;
  // 收藏数量
  starNum: number;
};

// 商城信息 Schema
const shop = new Schema<Shop>({
  username: String,
  name: String,
  avatar: String,
  deployId: String,
  developedId: String,
  starNum: Number,
});

export default model('shop', shop);