export enum CommodityLayout {
  // 一行一个
	One = 'one-line-one-commodity',
  // 一行两个
  Two = 'one-line-two-commodity',
   // 横向滑动
  Inline = 'inline-commodity'
}

// 商品分组排序方式
export enum CommoditiesOrder {
  // 按时间排序
  Time = 1,
  // 按销量排序
  Sale = 2,
  // 默认排序
  Default = 0,
}

export interface CommodityPropValue {
	// 商品间距
  padding: number;
  // 布局
  layout:CommodityLayout;
  // 展示的商品 id
  commodities: string[];
  // 是否显示描述
  isShowDesc: boolean;
  // 是否显示原始价格
  isShowOriginPrice: boolean,
  // 是否为圆角
  isRound: boolean;
  // 排序
  sort: CommoditiesOrder;
}

// 商品状态
export enum CommodityStatus {
  // 仓库中
  OnStore = 0,
	// 上架
  OnSale = 1,
  // 售罄
  SoldOut = 2,
}

// 商品分类
export interface Commodity {
  // 商品 id
	_id: string;
  // 商品名称
  name: string;
  // 商品封面
  imagesSrc: string[];
  // 商品描述
  desc: string;
  // 商品分类（用于商品分类展示）
  type: string;
  // 商品状态
  status: CommodityStatus;
  // 商品价格
  price: number;
  // 商品折扣
  discount: number;
  // 库存
  stock: number;
  // 运费
  freight: number;
  // 销量
  sales: number;
  // 添加时间
  addTime: number;
}