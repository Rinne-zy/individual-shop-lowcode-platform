
import type { Commodity } from "lowcode-platform-common/type/commodity";
import { LOCAL_STORAGE_KEY_OF_TOKEN } from "lowcode-platform-common/common/index";
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
export async function starCommodity(commodityId: string) {
  const resp = post({
    url: 'commodity/star',
    data: {
      commodityId,
    }
  });

  const { code, msg, status } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
    return;
  }

  return status;
}
