import { Schema, model } from "mongoose";

export interface User {
  username: string,
  password: string,
  userType: number,
}

// 用户信息 Schema
const userSchema = new Schema({
  username: String,
  password: String,
  userType: Number,
});

export default model('user', userSchema);