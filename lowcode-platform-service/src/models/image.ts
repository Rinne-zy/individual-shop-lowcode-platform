import { Schema, model } from "mongoose";

export interface Image {
  username: string,
  name: string,
  src: string,
}

// 图片信息 Schema
const imageSchema = new Schema({
  username: String,
  name: String,
  src: String,
});

export default model('image', imageSchema);