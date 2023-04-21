
import type { Commodity } from "lowcode-platform-common/type/commodity";
import { get, post } from "./request";
import { showFailToast } from "lowcode-platform-weixin-renderer/utils/toast";
import { handleErrorCode } from "lowcode-platform-weixin-renderer/utils/error";

/** 商品详情页信息 */
export interface CommodityDetail {
  shop: {
    id: string;
    name: string;
    avatar: string;
    starNum: number;
  },
  commodity: Commodity,
}

/**
 * 获取商品详情信息
 * @param shopId 商店id
 * @param commodityId 商品 id 
 * @returns 
 */
export async function getCommodityDetail(shopId: string, commodityId: string) {
  const resp = await get({
    url: `commodity/getDetail?shopId=${shopId}&commodityId=${commodityId}`
  });

  const { code, msg, data } = await resp as any;

  if(code) {
    showFailToast(msg);
    return null;
  };

  return data as CommodityDetail;
};

/**
 * 收藏商品
 * @param commodity 商品 id
 * @returns 
 */
export async function starCommodity(commodityId: string, shopId: string) {
  const resp = post({
    url: 'commodity/star',
    data: {
      commodityId,
      shopId,
    }
  });

  const { code, msg, status } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
    return;
  }

  return status;
}

/**
 * 根据 id 获取商品
 * @param ids 商品 _id
 * @returns 
 */
export async function getCommoditiesByType(shopId: string, type: string | undefined, number: number, sort: 'hot' | 'new') {
  const resp = post({
    url: `commodity/nl/${sort}`,
    data: {
      shopId,
      type,
      number,
    }
  });
  
  const { code, msg, commodities } = await resp as any;

  if(code) {
    showFailToast(msg);
    throw new Error(msg);
  }

  return commodities as Commodity[];
}
