import { Schema, model } from "mongoose";

export interface ShopSchemaType {
  /** 用户名 */
  username: string,
  /** 商城名称 */
  name: string
  /** schema */
  schema: Object,
  /** 创建日期 */
  created: number,
  /** 修改日期 */
  modified : number,
}

// 商城信息 Schema
const shopSchema = new Schema({
  username: String,
  name: String,
  schema: Object,
  created: Number,
  modified : Number,
});

export default model('schema', shopSchema);