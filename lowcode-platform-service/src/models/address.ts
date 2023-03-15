import { Schema, model } from "mongoose";

// 地址信息
export interface AddressInfo {
    id: string
    tel: string;
    name: string;
    city: string;
    county: string;
    country: string;
    province: string;
    areaCode: string;
    addressDetail: string;
}

export interface UserAddress {
  // 用户名
  username: string;
  // 当前选择的地址 id
  selectedAddressId: string;
  // 默认地址 id
  defaultAddressId: string
  // 地址信息
  address: AddressInfo[];
}

// 图片信息 Schema
const addressSchema = new Schema<UserAddress>({
  username: String,
  selectedAddressId: String,
  defaultAddressId: String,
  address: Array,
});

export default model('address', addressSchema);
