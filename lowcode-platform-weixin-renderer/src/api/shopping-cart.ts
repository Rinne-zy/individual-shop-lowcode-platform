import { showFailToast, showSuccessToast } from 'lowcode-platform-weixin-renderer/utils/toast';
import { LOCAL_STORAGE_KEY_OF_TOKEN } from "lowcode-platform-common/common/index";
import type { ShoppingCartInfo } from "lowcode-platform-common/type/commodity";
import { handleNotLogin } from "lowcode-platform-weixin-renderer/utils/login";
import type { ChangeNumType } from 'lowcode-platform-common/type/shopping-cart';
import { get, post } from "./request";

/**
 * 获取购物车列表
 * @returns 
 */
export async function getShoppingCartInfo() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await get({
    url: 'shoppingCart/get',
    header: {
      Authorization: token,
    }
  });

  const { code, msg, cart } = await resp as any

  if(code) {
    handleNotLogin(code);
    showFailToast(msg)
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
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await post({
    url: `shoppingCart/${type}CommodityNum`,
    header: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    data: {
      cartId,
      shopId,
      commodityId,
    }
  });

  const { code, msg } = await resp as any;

  if(code) {
    handleNotLogin(code);
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
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await post({
    url: `shoppingCart/selectCommodity`,
    header: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    data: {
      cartId,
      shopId,
      commodityId,
    }
  });

  const { code, msg } = await resp as any;

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
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await post({
    url: `shoppingCart/selectShopAllCommodities`,
    header: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    data: {
      cartId,
      shopId,
    }
  });

  const { code, msg } = await resp as any;

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
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await post({
    url: `shoppingCart/add`,
    header: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    data: {
      shopId,
      commodityId,
    }
  });

  const { code, msg, isAdd } = await resp as any;

  if(code) {
    handleNotLogin(code);
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
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await post({
    url: `shoppingCart/deleteCommodity`,
    header: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    data: {
      cartId,
      shopId,
      commodityId,
    }
  });

  const { code, msg, isAdd } = await resp as any;

  if(code) {
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(msg);
}