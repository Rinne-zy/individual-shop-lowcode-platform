import { Schema, model } from "mongoose";

export interface CascaderPanelOption {
  // 级联选择标签
  label: string;
  // 级联选择值
  value: string;
  // 子数组
  children: CascaderPanelOption[],
};

const typeSchema = new Schema({
  name: String,
  username: String,
  options: Array,
})

export default model('type', typeSchema);