import { Schema, model } from "mongoose";

export interface User {
  username: string;
  password: string;
  userType: number;
  avatar: string;
  nickName: string;
  starCommodities: Record<string, boolean>;
  starShops: Record<string, boolean>;
}

// 用户信息 Schema
const userSchema = new Schema<User>({
  username: String,
  password: String,
  userType: Number,
  avatar: String,
  starCommodities: Object,
  nickName: String,
  starShops: Object,
});

export default model('user', userSchema);