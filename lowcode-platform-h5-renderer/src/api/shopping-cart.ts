import { showFailToast, showSuccessToast } from "vant";

import { LOCAL_STORAGE_KEY_OF_TOKEN, FETCH_URL_PREFIX } from "lowcode-platform-common/common/index";
import type { ShoppingCartInfo } from "lowcode-platform-common/type/commodity";
import { handleNotLogin } from "lowcode-platform-h5-renderer/utils/login";

import type { ChangeNumType } from 'lowcode-platform-common/type/shopping-cart';

/**
 * 获取购物车列表
 * @returns 
 */
export async function getShoppingCartInfo() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}shoppingCart/get`, {
    headers: {
      Authorization: token,
    }
  });

   if(resp.status !== 200 || !resp.ok) throw new Error('获取商品请求异常');
  const { code, msg, cart } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return;
  };

  return cart as ShoppingCartInfo;
};

/**
 * 处理购物车商品数目变化
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @param commodityId 商品 id 
 * @param type 类型（加 1/减 1）
 * @returns 
 */
export async function changeCommodityNum(cartId: string, shopId: string, commodityId: string, type: ChangeNumType) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}shoppingCart/${type}CommodityNum`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId,
      shopId,
      commodityId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('添加商品请求异常');
  const { code, msg } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return code;
  };

  return code;
};

/**
 * 选中商品
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @param commodityId 商品 id 
 * @returns 
 */
export async function selectCommodity(cartId: string, shopId: string, commodityId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}shoppingCart/selectCommodity`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId,
      shopId,
      commodityId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('选择商品请求异常');
  const { code, msg } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return code;
  };

  return code;
};

/**
 * 选中购物车中某个商城的所有商品
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @returns 
 */
export async function selectShopAllCommodities(cartId: string, shopId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}shoppingCart/selectShopAllCommodities`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId,
      shopId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('选择商品请求异常');
  const { code, msg } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return code;
  };

  return code;
};


/**
 * 向购物车添加商品
 * @param shopId 商城 id
 * @param commodityId 商品 id
 * @returns 
 */
export async function addCommodityToCart(shopId: string, commodityId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}shoppingCart/add`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shopId,
      commodityId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('添加商品请求异常');
  const { code, msg, isAdd } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(isAdd ? '添加成功' : '当前商品已存在购物车中，快去结算吧！');
};

/**
 * 从购物车中删除商品
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @param commodityId 商品 id
 */
export async function deleteCommodityFromCart(cartId: string, shopId: string, commodityId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}shoppingCart/deleteCommodity`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId,
      shopId,
      commodityId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('删除商品请求异常');
  const { code, msg, isAdd } = await resp.json();

  if(code) {
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(msg);
}