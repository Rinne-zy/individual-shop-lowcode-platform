import { FETCH_URL_PREFIX, LOCAL_STORAGE_KEY_OF_TOKEN } from 'lowcode-platform-common/common/index';
import type { ShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { showFailToast } from 'vant';

/**
 * 根据商城 id 获取商城 schema
 * @param id 商城 id
 * @returns 
 */
export async function getShopById(id: string) {
  const resp = await fetch(`${FETCH_URL_PREFIX}shop/get/dep?shopId=${id}`);
  if(resp.status !== 200 || !resp.ok) throw new Error('获取商城请求异常');

  const { code, shop } = await resp.json();
  if(code) return {} as ShopStore;
  
  return shop as ShopStore;
};

/**
 * 收藏商城
 * @param shopId 商城 id
 * @returns 
 */
export async function starShop(shopId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}shop/star`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shopId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('收藏店铺请求异常');
  const { code, msg, status } = await resp.json();

  if(code) {
    showFailToast(msg);
    throw new Error(msg);
  }

  return status;
}