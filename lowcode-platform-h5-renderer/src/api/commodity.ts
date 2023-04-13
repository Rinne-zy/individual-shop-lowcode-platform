import { showFailToast } from "vant";

import type { Commodity } from "lowcode-platform-common/type/commodity";
import { FETCH_URL_PREFIX, LOCAL_STORAGE_KEY_OF_TOKEN } from "lowcode-platform-common/common/index";
import { handleNotLogin } from "lowcode-platform-h5-renderer/utils/login";

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
  const resp = await fetch(`${FETCH_URL_PREFIX}commodity/getDetail?shopId=${shopId}&commodityId=${commodityId}`);

   if(resp.status !== 200 || !resp.ok) throw new Error('获取商品请求异常');
  const { code, msg, data } = await resp.json();

  if(code) {
    showFailToast(msg);
    throw new Error(msg);
  };

  return data as CommodityDetail;
};

/**
 * 收藏商品
 * @param commodity 商品 id
 * @returns 
 */
export async function starCommodity(commodityId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}commodity/star`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      commodityId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('收藏商品请求异常');
  const { code, msg, status } = await resp.json();

  if(code) {
    const notLogin = handleNotLogin(code);
    showFailToast(notLogin ? '登录信息已过期，请重新登录！' : msg);
    throw new Error(msg);
  }

  return status;
}
