import { Document, Types } from 'mongoose';

import { StatusCode } from '../const';
import ShoppingCart from '../models/shopping-cart';
import type { ShoppingCartInfo, ShopInShoppingCart } from '../models/shopping-cart';
import type { CommodityInShoppingCart } from '../models/shopping-cart';
import ShopSchema from '../models/schema';
import Commodity from './../models/commodity';
import { CommodityStatus }  from './../models/commodity';

// 接口返回的购物车商品信息
interface CommodityInfo {
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
	// 库存
	stock: number;
  // 商品状态
  status: CommodityStatus;
  // 是否被选中
  selected: boolean;
  // 是否被选中
  addTime: number
};

// 接口返回的购物车商城信息
interface ShopInfo {
	// 商城 id
	_id: string;
	// 商城名称
	name: string;
  // 最近添加商品时间
  modified: number;
	// 商品
	commodities: CommodityInfo[]
};

type ShoppingCartInfoDocument = (Document<unknown, any, ShoppingCartInfo> & ShoppingCartInfo & {
  _id: Types.ObjectId;
});

/**
 * 购物车添加商品
 * @param username 用户名
 * @param shopId 商城 id
 * @param commodityId 商品 id
 * @returns 
 */
export async function addShoppingCartInfo(username: string, shopId: string, commodityId: string) {
  const userShoppingCart = await ShoppingCart.findOne({ username });
  const shop = await ShopSchema.findById(shopId);
  if(!shop) throw new Error('商城信息错误，添加失败');

  // 新添加至购物车的商品
  const commodity: CommodityInShoppingCart = {
    _id: commodityId,
    selected: true,
    number: 1,
    addTime: Date.now(),
  };

  if(!userShoppingCart) {
    // 购物车中商城信息
    const shopInfo: ShopInShoppingCart = {
      _id: shopId,
      name: shop.name as string,
      commodities: [
        commodity,
      ]
    };
    // 不存在购物车信息
    await ShoppingCart.create({
      username,
      shop: shopInfo,
    });
    return {
      code: StatusCode.Success,
      msg: '添加购物车成功',
    }
  };

  addCommodityToShoppingCart(userShoppingCart, shopId, shop.name as string, commodity);
  userShoppingCart.markModified('shops');
  await userShoppingCart.save();

  return {
    code: StatusCode.Success,
    msg: '添加购物车成功',
  }
};

/**
 * 获取购物车信息
 * @param username 用户名
 * @returns 
 */
export async function getShoppingCartInfo(username: string) {
  const shoppingCart = await ShoppingCart.findOne({ username });
  
  if(!shoppingCart) {
    const newCart = {
      username,
      shop: [],
    }
    // 若不存在相应的购物车信息
    await ShoppingCart.create(newCart);

    return {
      code: StatusCode.Success,
      msg: '获取购物车成功',
      cart: newCart
    };
  }

  const { shops } = shoppingCart;
  const { shopsInShoppingCart, totalPrice } = await getCommoditiesDetailFromShoppingCart(shops);

  const cart = {
    _id: shoppingCart._id,
    username,
    shops: shopsInShoppingCart,
    // 总价
    totalPrice,
  }
  
  return {
    code: StatusCode.Success,
    msg: '获取购物车成功',
    cart
  };
}

/**
 * 处理购物车中商品数目变化
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @param commodityId 商品 id
 * @param num 改变的数目
 * @returns 
 */
export async function handleChangeCartCommodityNum(cartId: string, shopId: string, commodityId: string, num = 1) {
  const { cart, shopIndex, commodityIndex, commodity } = await findCommodityInfoFromCart(cartId, shopId, commodityId);

  if(!commodity) {
    // 当商品被删除移除掉该商品
    await handleCartCommodityNotExist(cart, shopId, commodityId);
    throw new Error('当前商品不存在');
  };
  if(commodity.status !== CommodityStatus.OnSale) throw new Error('添加失败，当前商品已不在上架状态');
  // 判断是否售罄
  if(commodity.stock < cart.shops[shopIndex].commodities[commodityIndex].number + num) throw new Error('添加失败，当前商品已售罄！');

  cart.shops[shopIndex].commodities[commodityIndex].number += num;
  cart.markModified('shops');
  cart.save();

  return {
    code: StatusCode.Success,
    msg: '成功',
  };
}

/**
 * 选择商品
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @param commodityId 商品 id
 * @returns 
 */
export async function handleSelectCartCommodity(cartId: string, shopId: string, commodityId: string) {
  const { cart, shopIndex, commodityIndex } = await findCommodityInfoFromCart(cartId, shopId, commodityId, false);

  cart.shops[shopIndex].commodities[commodityIndex].selected = !cart.shops[shopIndex].commodities[commodityIndex].selected;
  cart.markModified('shops');
  cart.save();

  return {
    code: StatusCode.Success,
    msg: '操作成功',
  };
}

/**
 * 选择购物车中商城中的所有商品
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @returns 
 */
export async function handleSelectCartShopAllCommodities(cartId: string, shopId: string) {
    // 查找购物车商品列表
  const cart = await ShoppingCart.findOne({
    _id: cartId,
  });

  if(!cart) throw new Error('购物车异常');

  const { shops } = cart;
  const shopIndex = shops.findIndex((shop) => shop._id === shopId);
  if (shopIndex === -1) throw new Error('购物车不存在该商城的商品');

  shops[shopIndex].commodities.forEach((commodity, index) => {
    shops[shopIndex].commodities[index].selected = !commodity.selected;
  });
  cart.markModified('shops');
  cart.save();

  return {
    code: StatusCode.Success,
    msg: '操作成功',
  };
}

/**
 * 获取购物车中的商品详情信息以及选中商品的总价
 * @param shopInShoppingCart 购物车中商品信息
 * @returns 
 */
async function getCommoditiesDetailFromShoppingCart(shopInShoppingCart: ShopInShoppingCart[]): Promise<{ totalPrice: number, shopsInShoppingCart: ShopInfo[]}> {
  let totalPrice = 0;
  const shops = await Promise.all(
    shopInShoppingCart.map(async (shop) => {
      // 最近购物车中添加该商城的时间戳
      let lastModified = 0;
      const commodities = await Promise.all(
        shop.commodities.map((commodityInCart) => new Promise<CommodityInfo | null>(async (resolve, reject) => {
          // 根据每一个商城中的商品 id 获取购物车中商品展示所需要的信息
          try {
            // 原来购物车中的商品数据
            const { _id, selected, number, addTime } = commodityInCart;
            const commodity = await Commodity.findById(_id);
            if(!commodity) return null;
  
            const { name, price, stock, imagesSrc, status, discount } = commodity;
            const actualPrice = price * discount * 0.01;
            lastModified = Math.max(addTime, lastModified);

            // 计算当前购物车总价
            if(status === CommodityStatus.OnSale && selected) {
              totalPrice += actualPrice;
            };

            resolve({
              _id,
              name,
              price: actualPrice,
              stock,
              cover: imagesSrc[0],
              status,
              selected,
              number,
              addTime
            });
          } catch (err) {
            reject(null);
          }})
        ));

        return {
          _id: shop._id,
          name: shop.name,
          modified: lastModified,
          commodities:  commodities.filter((commodity) => commodity) as CommodityInfo[] ,
        };
    })
  );

  return {
    shopsInShoppingCart: shops,
    totalPrice,
  };
};

/**
 * 向购物车中添加新商品
 * @param shoppingCart 购物车
 * @param commodity 商品
 * @returns 
 */
function addCommodityToShoppingCart(shoppingCart: ShoppingCartInfoDocument, shopId: string, name: string, commodity: CommodityInShoppingCart) {
  const { shops } = shoppingCart;
  // 购物车中不存在该商城的商品信息
  const shopIndex = shops.findIndex((shop) => shop._id === shopId);
  if(shopIndex === -1) {
    shops.push({
      _id: shopId,
      name,
      commodities: [commodity],
    });
    return;
  }

  const index = shops[shopIndex].commodities.findIndex((c) => c._id === commodity._id);
  if(index === -1) {
    // 已存在该商店信息，直接添加商品
    shops[shopIndex].commodities.push(commodity);
    return;
  }

  // 存在同一个商品，数量加一
  shops[shopIndex].commodities[index].number += 1;
  return;
};

/**
 * 从购物车信息中获取商品相关信息（商品详情、位于购物车中的索引）
 * @param cartId 购物车 id
 * @param shopId 商城 id
 * @param commodityId 商品 id
 * @returns 
 */
async function findCommodityInfoFromCart(cartId: string, shopId: string, commodityId: string, isNeedToGetCommodity = true) {
  const [commodity, cart] = await Promise.all([
    // 查找商品
    isNeedToGetCommodity ? Commodity.findById(commodityId) : null,
    // 查找购物车商品列表
    ShoppingCart.findOne({
      _id: cartId,
    }),
  ]);

  if(!cart) throw new Error('购物车异常');

  const { shops } = cart;
  const shopIndex = shops.findIndex((shop) => shop._id === shopId);
  if (shopIndex === -1) throw new Error('添加异常，当前购物车不存在该商品，请刷新页面');

  const commodityIndex = shops[shopIndex].commodities.findIndex((commodity) => commodity._id === commodityId);
  if (commodityIndex === -1) throw new Error('添加异常，当前购物车不存在该商品，请刷新页面');

  return {
    cart,
    shopIndex,
    commodityIndex,
    commodity,
  }
}

/**
 * 处理购物车中商品不存在情况
 * @param cart 
 * @param shopId 
 * @param commodityId 
 * @returns 
 */
async function handleCartCommodityNotExist(cart: ShoppingCartInfoDocument, shopId:string, commodityId: string) {
  const { shops } = cart;
  const shopIndex = shops.findIndex((shop) => shop._id === shopId);
  if (shopIndex === -1) return;

  const commodityIndex = shops[shopIndex].commodities.findIndex((commodity) => commodity._id === commodityId);
  if (commodityIndex === -1) return;

  shops[shopIndex].commodities.splice(commodityIndex, 1);
  cart.markModified('shops');
  await cart.save();
}