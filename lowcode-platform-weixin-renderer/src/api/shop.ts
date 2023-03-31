import { LOCAL_STORAGE_KEY_OF_TOKEN } from 'lowcode-platform-common/common';
import type { ShopStore } from 'lowcode-platform-weixin-renderer/store/schema';
import { get, post } from './request';

/**
 * 根据商城 id 获取商城 schema
 * @param id 商城 id
 * @returns 
 */
export async function getShopById(id: string) {
  const resp = await get({
    url: `shop/get/dep?shopId=${id}`
  });
  const { code, shop } = await resp as any;
  if(code) return {} as ShopStore;
  
  return shop as ShopStore;
};

/**
 * 收藏商城
 * @param shopId 商城 id
 * @returns 
 */
export async function starShop(shopId: string) {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await post({
    url: 'user/starShops',
    header: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    data: {
      shopId,
    }
  });

  const { code, msg, status } = await resp as any;

  if(code) {
    throw new Error(msg);
  }

  return status;
}