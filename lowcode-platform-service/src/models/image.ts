import { Schema, model } from "mongoose";

export interface Image {
  /** 用户名 */
  username: string,
  /** 图片名称 */
  name: string,
  /** 图片链接 */
  src: string,
  /** 图片分类 */
  type: string
  /** 修改日期 */
  modified : number,
}

// 图片信息 Schema
const imageSchema = new Schema({
  username: String,
  name: String,
  src: String,
  type: String,
  modified : Number,
});

export default model('image', imageSchema);