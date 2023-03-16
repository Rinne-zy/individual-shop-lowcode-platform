// 商品状态
export enum CommodityStatus {
  // 仓库中
  OnStore = 0,
	// 上架
  OnSale = 1,
  // 售罄
  SoldOut = 2,
}
// 商品信息
export interface Commodity {
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
}

// 后端组装返回的
export interface ShoppingCartInfo {
	// 购物车唯一 id
	_id: string;
	// 用户名
	username: string;
	// 商品，key 为 商城 id-name
	commodities: Record<string, Commodity[]>
}