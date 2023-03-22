import { defineStore } from 'pinia';

/** 商品详情页 */
export interface CommodityDetailStore {
  shopId: string;
  commodityId: string;
  isStar: boolean;
}

export const useCommodityDetailStore = defineStore('commodity-detail', {
  state: (): CommodityDetailStore => {
    return {
      shopId: '',
      commodityId: '',
      isStar: false,
    }
  },
  actions:{
    reset() {
      this.shopId = '';
      this.commodityId = '';
      this.isStar = false;
    },
  }
})