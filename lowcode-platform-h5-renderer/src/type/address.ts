import type { AddressEditInfo } from "vant";

// 地址信息
export interface AddressInfo extends AddressEditInfo {
  id: string,
};

// 用户地址
export interface UserAddress {
  /** 用户地址记录 id */
  _id: string;
  /** 用户名 */
  username: string;
  /** 选中的地址 id */
  selectedAddressId: string;
  /** 默认地址 id */
  defaultAddressId: string
  /** 地址信息 */
  address: AddressInfo[];
}