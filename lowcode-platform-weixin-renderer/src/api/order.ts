import type { Order } from 'lowcode-platform-common/type/order';
import { LOCAL_STORAGE_KEY_OF_TOKEN, FETCH_URL_PREFIX } from "lowcode-platform-common/common/index";
import { get, post } from './request';
import { showFailToast, showSuccessToast } from 'lowcode-platform-weixin-renderer/utils/toast';

/**
 * 提交订单
 * @returns 
 */
export async function createOrder() {
  const resp = post({
    url: 'order/create',
  })
 
  const { code, msg, ids } = await resp as any;

  if(code !== 0) {
    showFailToast(msg);
    throw new Error('提交订单失败');
  };

  return ids as string[];
}

/** 获取顾客的订单数据 */
export async function getOrderForm() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await get({
    url: 'order/customer/get',
    header: {
      Authorization: token
    }
  })

  const { code, msg, orders } = await resp as any;

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
  const resp = post({
    url: 'order/customer/pay',
    data: {
      ids,
    }
  })
 
  const { code, msg } = await resp as any;

  if(code !== 0) {
    showFailToast(msg);
    throw new Error(msg);
  };
}

/**
 * 取消订单
 * @param id 订单 id
 */
export async function cancelOrderForm(id: string) {
  const resp = post({
    url: 'order/customer/cancel',
    data: {
      id,
    }
  })

  const { code, msg } = await resp as any;

  if(code !== 0) {
    showFailToast(msg);
    throw new Error(msg);
  };

}
/**
 * 确认订单已收货
 * @param id 订单 id
 */
export async function finishOrder(id: string) {
  const resp = post({
    url: 'order/customer/finish',
    data: {
      id,
    }
  })

  const { code, msg } = await resp as any;

  if(code !== 0) {
    throw new Error(msg);
  };

}

/** 获取顾客的订单数据类型 */
export async function getOrderFormTypeNumber() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await get({
    url: `order/customer/typeNumber`,
    header: {
      Authorization: token
    }
  });

  const { code, msg, status } = await resp as any;

  if(code !== 0) {
    showSuccessToast(msg);
    throw new Error('获取订单失败');
  };

  return status as {
    paying: number;
    preparing: number;
    delivering: number;
  };
}
