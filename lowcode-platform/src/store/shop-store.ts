
import { getShops, Shop } from "lowcode-platform/api/shop";
import { StatusCode } from "lowcode-platform/api/type";
import { defineStore } from "pinia";

export interface ShopStore {
  shops: Shop[],
  selectShopId: string,
}

export const useShopsStore = defineStore('shop', {
  state: (): ShopStore =>  {
    return {
      shops: [],
      selectShopId: ''
    }
  },
  actions:{
    async getMyShops() {
      const { data } = await getShops();
      if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
      this.shops = data.shops;
    }
  }
})