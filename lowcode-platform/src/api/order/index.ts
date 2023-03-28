import axios from 'axios';

import { Order } from 'lowcode-platform-common/type/order';
import type { BaseResp } from '../type';

export interface OrdersResp extends BaseResp {
  orders: Order[]
};


/**
 * 根据用户名获取订单数据
 * @param username 用户名
 * @returns 
 */
export async function getOrdersByUsername() {
  const res = await axios<OrdersResp>({
    method: 'get',
    url: `order/merchant/get`,
  });

  return res;
}

/**
 * 发货
 * @param id 订单 id
 * @param trackingNumber 物流订单号 
 * @returns 
 */
export async function deliverOrderForm(id: string, trackingNumber: string) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: `order/merchant/deliver`,
    data: {
      id,
      trackingNumber,
    }
  });

  return res;
}