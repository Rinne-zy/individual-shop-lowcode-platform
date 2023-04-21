// 商品分组布局
export enum CommodityLayout {
  // 一行一个
	One = 'one-line-one-commodity',
  // 一行两个
  Two = 'one-line-two-commodity',
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

export interface CommodityGrouping {
  // 分组名称
  name: string;
  // 分组唯一标识
  value: string;
  // 是否按最新排序
  order: CommoditiesOrder;
  // 商品
  commodities: string[];
  // 展示的数量
  showNumber: number;
  // 分组商品类型
  type?: string
}

export interface GroupingPropValue {
  // 商品间距
  padding: number;
  // 布局
  layout: CommodityLayout;
  // 展示的商品 id
  grouping: CommodityGrouping[];
  // 是否显示描述
  isShowDesc: boolean;
  // 是否显示原始价格
  isShowOriginPrice: boolean,
  // 是否为圆角
  isRound: boolean;
}