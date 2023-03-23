import { Schema, model } from "mongoose";

// 购物车的商品
export interface CommodityInShoppingCart {
	// 商品 id
	_id: string;
  // 是否被选中
  selected: boolean;
	// 数量
	number: number;
	// 添加时间
	addTime: number;
};

// 购物车中商城信息
export interface ShopInShoppingCart {
	// 商城 id
	_id: string;
	// 商城名称
	name: string;
	// 商城头像
	avatar: string
	// 商品
	commodities: CommodityInShoppingCart[]
}

// 购物车信息
export interface ShoppingCartInfo {
	// 用户名
	username: string;
	// 在购物车中的商品 key 为 商城id-商城名称
	shops: ShopInShoppingCart[];
};

// 购物车信息 Schema
const shoppingCartSchema = new Schema<ShoppingCartInfo>({
  username: String,
	shops: Array,
});

export default model('shoppingCart', shoppingCartSchema);