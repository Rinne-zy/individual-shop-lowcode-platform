import { Schema, model } from "mongoose";

interface Component {
  key: string
}

export interface ComponentSchema {
  // 编辑器样式
  editor: Record<string, string>;
  // 组件 schema
  components: Array<Component>;
}

/** schema 类型 */
export enum SchemaType {
  Develop = 'develop',
  Deploy = 'deploy',
}

export interface ShopSchema {
  /** schema */
  schema: ComponentSchema;
  /** 修改日期 */
  modified: number;
  /** 版本号 */
  version: number;
  /** schema 的类型 */
  type: SchemaType;
  /** 商品 */
  commodities: string[]
}

// 商城信息 Schema
const shopSchema = new Schema<ShopSchema>({
  schema: Object,
  // 需要将数组默认值重置为 undefined
  commodities: {
    type: [String],
    default: undefined
  },
  modified: Number,
  version: Number,
  type: String,
});

export default model('schema', shopSchema);