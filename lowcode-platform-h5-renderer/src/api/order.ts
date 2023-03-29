import type { Order } from 'lowcode-platform-common/type/order';
import { LOCAL_STORAGE_KEY_OF_TOKEN, FETCH_URL_PREFIX } from "lowcode-platform-h5-renderer/const";
import { showFailToast, showSuccessToast } from "vant";

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
 * 取消订单
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
/**
 * 确认订单已收货
 * @param id 订单 id
 */
export async function finishOrder(id: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}order/customer/finish`, {
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

/** 获取顾客的订单数据类型 */
export async function getOrderFormTypeNumber() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await fetch(`${FETCH_URL_PREFIX}order/customer/typeNumber`, {
    headers: {
      Authorization: token
    }
  });

  if(resp.status !== 200 || !resp.ok) {
    throw new Error('网络错误');
  };

  const { code, msg, status } = await resp.json();

  if(code !== 0) {
    showFailToast(msg);
    throw new Error('获取订单失败');
  };

  return status as {
    paying: number;
    preparing: number;
    delivering: number;
  };
}
