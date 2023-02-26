export interface SwipeItem {
  // 图片 id
	id?: string;
  // 图片链接
  src: string;
  // 转跳链接（可续，商品地址 or 现有地址）
  link?: string;
}

export interface SwipePropValue {
	// 轮播图选择的图片 id
  swipeItems: SwipeItem[]; 
  // 切换速度（单位秒）
  speed: number;
  // 懒加载
  lazyLoad: boolean;
}