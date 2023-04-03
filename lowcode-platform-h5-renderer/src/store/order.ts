import { defineStore } from 'pinia';

import type { AddressInfo } from 'lowcode-platform-common/type/address';
import type { ShopInfo } from 'lowcode-platform-common/type/commodity';

export enum OrderFormType {
  // 待付款
  Paying = 0,
  // 待发货
  Preparing = 1,
  // 发货中
  Delivering = 2,
  // 全部订单
  All = 3
};

/** 订单 */
export interface OrderStore {
  // 地址信息
  addressInfo: AddressInfo;
  // 商城信息
  shopsInfo: ShopInfo[];
  // 总价
  totalPrice: number;
  // 激活的订单分类 tab
  activeTab: OrderFormType;
}

export const useOrderStore = defineStore('order', {
  state: (): OrderStore => {
    return {
      addressInfo: {} as AddressInfo,
      shopsInfo: [],
      totalPrice: 0,
      activeTab: OrderFormType.All,
    }
  }
})