import { Document, Types } from 'mongoose';

import { StatusCode } from '../const';
import User from './../models/user';
import ShoppingCart from '../models/shopping-cart';
import type { ShopInShoppingCart } from '../models/shopping-cart';
import Shop from '../models/shop';
import Commodity from './../models/commodity';
import Order, { CommodityInOrder, CustomerInOrder, OrderStatus } from './../models/order'
import type { Order as OrderFormType } from './../models/order';
import { CommodityStatus }  from './../models/commodity';
import { getCommoditiesFromShop } from './shop';
import { getAddressDetailInfo } from './address';

interface OrderForm {
  _id: Types.ObjectId
  shop: {
    _id: string;
    ownerId: string;
    name: string;
    avatar: string;
  };
  totalPrice: string;
  status: OrderStatus;
  created: number;
  trackingNumber: string;
  commodities: CommodityInOrder[];
  customer: CustomerInOrder;
}

interface CommodityInfoInOrder {
  // 商品 id
	_id: string;
	// 商品名称
	name: string;
	// 商品封面
	cover: string;
	// 商品价格
	price: number;
	// 数目
	number: number;
  // 分类
  type: string;
}

type OrderDocumentType = (Document<unknown, any, OrderFormType> & OrderFormType & {
  _id: Types.ObjectId;
})[]

/**
 * 创建订单
 * @param username 用户名
 * @param address 地址
 * @returns 
 */
export async function createOrder(username: string) {
  const shoppingCart = await ShoppingCart.findOne({ username });
  if(!shoppingCart) throw new Error('购物车信息错误，无法生成订单');

  const address = await getAddressDetailInfo(username);

  const { shops } = shoppingCart;

  const [shopsInOrder, user] = await Promise.all([
    getOrderInfoFromShoppingCart(shops),
    User.findOne({ username }),
  ]);

  if(!user) throw new Error('用户信息错误');

  const ids = await Promise.all(shopsInOrder.map(async (info) => {
    if(!info) return;
    const { shop, totalPrice, commodities } = info;

    if(!commodities.length) return;

    const orderForm = await Order.create({
      shop,
      customer: {
        username,
        address,
        nickName: user.nickName
      },
      commodities,
      created: Date.now(),
      trackingNumber: '',
      status: OrderStatus.Paying,
      totalPrice,
    });

    return orderForm._id;
  }));

  shopsInOrder.forEach((info) => {
    if(!info) return;
    const shop = shoppingCart.shops[info.shopIndex];
    info.selectedIds.forEach((id) => {
      const index = shop.commodities.findIndex((commodity) => commodity._id === id.toString());
      if(index !== -1) {
        shop.commodities.splice(index, 1);
      };
    })
  });

  shoppingCart.markModified('shops');
  await shoppingCart.save();

  return {
    code: StatusCode.Success,
    msg: '提交订单成功',
    ids: ids.filter((id) => id),
  }
};

/**
 * 用户获取的订单信息
 * @param username 
 * @returns 
 */
export async function getOrderByCustomerUserName(username: string) {
  const orderForms = await Order.find({ 'customer.username': username });

  let orders: OrderForm[] | null = null;

  if(!orderForms) return orders;

  orders = await getOrderForms(orderForms);

  return {
    code: StatusCode.Success,
    msg: '获取订单成功',
    orders,
  }
}

/**
 * 商家获取的订单信息
 * @param username 
 * @returns 
 */
export async function getOrderByMerchantUserName(username: string) {
  const orderForms = await Order.find({ 'shop.ownerId': username });
  
  let orders: OrderForm[] | null = null;

  if(!orderForms) return orders;

  orders = await getOrderForms(orderForms);

  return {
    code: StatusCode.Success,
    msg: '获取订单成功',
    orders,
  }
}

/**
 * 支付订单
 * @param ids 支付的订单号
 * @returns 
 */
export async function payOrderByOrderId(ids: string[] | string, username: string) {
  let orderIds: string[] | string = ids;
  if(!Array.isArray(ids)) {
    orderIds = [ids];
  };

  await Promise.all((orderIds as string[]).map( async (id) => {
    const order = await Order.findByIdAndUpdate(id, { status: OrderStatus.Preparing });
    if(!order) throw new Error('支付订单失败');
    if(order.customer.username !== username) throw new Error('用户名有误');
    // 增加商品销量
    await Promise.all(order.commodities.map((commodity) => Commodity.findByIdAndUpdate(commodity._id, { $inc: { sales: + 1 } })));
  }));

  return {
    code: StatusCode.Success,
    msg: '支付成功',
  }
}

/**
 * 取消订单
 * @param id 订单 id
 * @returns 
 */
export async function cancelOrderByOrderId(id: string, username: string) {
  const order = await Order.findById(id);
  if(!order) throw new Error('订单错误');
  if(order.customer.username !== username) throw new Error('用户名有误');

  const deleteOrder = await Order.findByIdAndDelete(id);
  if(!deleteOrder) throw new Error('删除失败');
  return {
    code: StatusCode.Success,
    msg: '取消订单成功',
  }
}

/**
 * 发货
 * @param id 订单 id
 * @param username 商家用户名
 * @param trackingNumber 订单号
 * @returns 
 */
export async function deliverOrderByOrderId(id: string, username: string, trackingNumber: string) {
  if(!trackingNumber) throw new Error('订单号不能为空');

  const order = await Order.findById(id);
  if(!order) throw new Error('订单错误');
  if(order.shop.ownerId !== username) throw new Error('用户名有误');
  if(order.status !== OrderStatus.Preparing) throw new Error('订单状态错误');

  // 更新为已发货
  order.status = OrderStatus.Delivering;
  order.trackingNumber = trackingNumber;
  order.markModified('status');
  order.markModified('trackingNumber');
  await order.save();

  return {
    code: StatusCode.Success,
    msg: '发货成功',
  }
}

/**
 * 完成订单
 * @param id 订单 id
 * @param username 商家用户名
 * @returns 
 */
export async function finishOrderByOrderId(id: string, username: string) {
  const order = await Order.findById(id);
  if(!order) throw new Error('订单错误');
  if(order.customer.username !== username) throw new Error('用户名有误');
  if(order.status !== OrderStatus.Delivering) throw new Error('订单状态错误');

  order.status = OrderStatus.Finished;
  order.markModified('status');
  await order.save();

  return {
    code: StatusCode.Success,
    msg: '已确认收货',
  }
}

/**
 * 获取订单类型数量
 * @param username 用户名
 * @returns 
 */
export async function getOrderTypeNumber(username: string) {
  const orderForms = await Order.find({ 'customer.username': username });

  let paying = 0, preparing = 0, delivering = 0;

  orderForms.forEach((orderForm) => {
    if(orderForm.status === OrderStatus.Paying) {
      paying += 1;
    } else if (orderForm.status === OrderStatus.Preparing) {
      preparing += 1;
    } else if (orderForm.status === OrderStatus.Delivering) {
      delivering +=1;
    }
  })

  return {
    code: StatusCode.Success,
    msg: '获取成功',
    status: {
      paying,
      preparing,
      delivering,
    }
  }
}

/**
 * 从购物车中获取订单数据
 * @param shopInShoppingCart 购物车中商城信息
 * @returns 
 */
async function getOrderInfoFromShoppingCart(shopInShoppingCart: ShopInShoppingCart[]) {
  const shopsInOrder = await Promise.all(
    shopInShoppingCart.map(async (shop, index) => {

      // 若当前商城不存在商品，直接过滤掉
      if(shop.commodities.length === 0) return null;

      // 获取商城信息
      const shopInfo = await Shop.findById(shop._id);
      if(!shopInfo) return null;

      const { name, username, _id, avatar } = shopInfo;

      const ids = await getCommoditiesFromShop(shop._id);

      // 设置用于判断该商城是否存在相应商品的 Map
      const isOnSalesIds :Record<string, boolean> = {}
      if(ids && ids.length) {
        ids.forEach((value) => isOnSalesIds[value] = true);
      };

      // 获取当前购物车中选中的需要结算的商品
      const selectedIds: Types.ObjectId[] = [];

      // 当前商城订单的总价
      let totalPrice = 0;
      const commodities = await Promise.all(
        shop.commodities.map((commodityInCart) => new Promise<CommodityInfoInOrder | null>(async (resolve, reject) => {
          // 根据每一个商城中的商品 id 获取购物车中商品展示所需要的信息
          try {
            // 原来购物车中的商品数据
            const { _id, selected, number } = commodityInCart;
            const commodity = await Commodity.findById(_id);
            if(!commodity) return null;


            const { name, price, imagesSrc, status, discount, type } = commodity;
            // 获取当前商品的状态，若商城 schema 中已取消该商品则需要表示为已下架
            let actualStatus = isOnSalesIds[commodity._id.toString()] ? status : CommodityStatus.OnStore
            // 已下的商品和未选中的商品的则返回为空
            if(actualStatus !== CommodityStatus.OnSale || !selected) return resolve(null);

            selectedIds.push(commodity._id);
            const actualPrice = price * discount * 0.01;
            totalPrice += actualPrice * number;

            resolve({
              _id: commodity._id.toString(),
              name,
              price: actualPrice,
              cover: imagesSrc[0],
              type, 
              number,
            });
          } catch (err) {
            reject(null);
          }})
        ));

        return {
          shop: {
            _id: _id.toString(),
            ownerId: username,
            name,
            avatar,
          },
          commodities:  commodities.filter((commodity) => commodity) as CommodityInfoInOrder[],
          shopIndex: index,
          selectedIds,
          totalPrice,
        };
    })
  );

  return shopsInOrder.filter((shop) => shop);
};


function getOrderForms(orderForms: OrderDocumentType) {
  return Promise.all(orderForms.map(async (orderForm) => {
    const { commodities, totalPrice, trackingNumber, created, status, customer  } = orderForm
    let { _id, name, avatar, ownerId } = orderForm.shop;
    const shop = await Shop.findById(_id);
    // 获取最新商城的信息
    if(shop) {
      name = shop.name;
      avatar = shop.avatar;
    }

    return {
      _id: orderForm._id,
      totalPrice,
      status,
      created,
      trackingNumber,
      commodities,
      customer,
      shop: {
        _id,
        name,
        avatar,
        ownerId
      }
    }
  }));
}