// 商品状态
export enum CommodityStatus {
  // 仓库中
  OnStore = 0,
	// 上架
  OnSale = 1,
  // 售罄
  SoldOut = 2,
}

// 后台返回的购物车商品信息
export interface CommodityInfo {
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

// 后台返回的购物车商城信息
export interface ShopInfo {
	// 商城 id
	_id: string;
	// 商城名称
	name: string;
  // 最近添加商品时间
  modified: number;
	// 商品
	commodities: CommodityInfo[]
}

// 后台返回的购物车信息
export interface ShoppingCartInfo {
	// 购物车唯一 id
	_id: string;
	// 用户名
	username: string;
	// 商品，key 为 商城 id-name
	shops: ShopInfo[],
	// 总价
	totalPrice: number,
}