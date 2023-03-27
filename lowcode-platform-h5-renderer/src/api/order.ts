import { LOCAL_STORAGE_KEY_OF_TOKEN, FETCH_URL_PREFIX } from "lowcode-platform-h5-renderer/const";
import { showFailToast, showSuccessToast } from "vant";

export enum OrderStatus {
  // 待支付
  Paying = 0,
  // 待发货
  Preparing = 1,
  // 发货中
  Delivering = 2,
  // 已完成
  Finished = 3
}

export interface ShopInOrder {
  // 商城 id
  _id: string;
  // 商城名称
  name: string;
  // 商城封面
  avatar: string;
  // 商城拥有者 id
  ownerId: string;
}

export interface CustomerInOrder {
  // 用户名
  username: string;
  // 地址
  address: string;
};

export interface CommodityInOrder {
  // 商品 id
  _id: string;
  // 商品名称
  name: string
  // 价格
  price: number;
  // 数量
  number: number;
  // 类型
  type: string;
  // 描述
  desc: string;
  // 封面
  cover: string;
}

export interface Order {
  _id: string;
  // 商城信息
  shop: ShopInOrder;
  // 订单顾客信息
  customer: CustomerInOrder;
  // 订单的商品信息
  commodities: CommodityInOrder[];
  // 订单状态
  status: OrderStatus,
  // 订单创建时间
  created: number;
  // 订单的快递单号
  trackingNumber: string;
  // 总价格
  totalPrice: number;
}

/**
 * 提交订单
 * @param address 用户地址
 * @returns 
 */
export async function createOrder() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}order/create`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    }
  });

  if(resp.status !== 200 || !resp.ok) {
    return false;
  };
  const { code, msg, ids } = await resp.json();

  if(code !== 0) {
    showFailToast(msg);
    throw new Error('提交订单失败');
  };

  return ids as string[];
}

/** 获取顾客的订单数据 */
export async function getOrderForm() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}order/customer/get`, {
    headers: {
      Authorization: token
    }
  });

  if(resp.status !== 200 || !resp.ok) {
    return [];
  };

  const { code, msg, orders } = await resp.json();

  if(code !== 0) {
    showFailToast(msg);
    throw new Error('获取订单失败');
  };

  return orders as Order[];
}

/**
 * 支付订单
 * @param id 订单 id
 */
export async function payOrderForm(ids: string | string[]) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}order/customer/pay`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ids,
    })
  });

  if(resp.status !== 200 || !resp.ok) {
    throw new Error('网络错误');
  };

  const { code, msg } = await resp.json();

  if(code !== 0) {
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(msg);
}

/**
 * 支付订单
 * @param id 订单 id
 */
export async function cancelOrderForm(id: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}order/customer/cancel`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
    })
  });

  if(resp.status !== 200 || !resp.ok) {
    throw new Error('网络错误');
  };

  const { code, msg } = await resp.json();

  if(code !== 0) {
    showFailToast(msg);
    throw new Error(msg);
  };

  showSuccessToast(msg);
}