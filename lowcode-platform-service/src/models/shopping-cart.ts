import { Schema, model } from "mongoose";

// 购物车的商品
interface CommodityInShoppingCart {
	// 商品 id
	_id: string;
  // 商品状态
  status: string;
  // 是否被选中
  selected: boolean;
	// 数量
	number: number;
};

// 购物车信息
interface ShoppingCart {
	// 购物车唯一 id
	_id: string;
	// 用户名
	username: string;
	// 在购物车中的商品 key 为 商城id-商城名称
	commodities: Record<string, CommodityInShoppingCart>;
};

