import { defineStore } from 'pinia';

// 菜单项类型
export interface MenuItem {
  name: string,
  value: string,
  icon: string,
}

// 商家用户菜单项
const merchantMenuItems: Array<MenuItem> = [
  {
    name: '我的商城',
    value: '/shop',
    icon: 'icon-home'
  },
  {
    name: '页面搭建',
    value: '/construction',
    icon: 'icon-construction'
  },
  {
    name: '商品管理',
    value: '/commodity',
    icon: 'icon-commodity-manage'
  },
  {
    name: '图片管理',
    value: '/picture',
    icon: 'icon-pic'
  },
  {
    name: '订单管理',
    value: '/order',
    icon: 'icon-order'
  }
];

export const useMenuStore = defineStore('menu', {
  state:() => {
    return {
      menu: merchantMenuItems,
      activatedMenu: '/shop',
    }
  },
  actions: {
    changeActiveMenu(routerPath: string) {
      this.activatedMenu = routerPath;    
    }
  }
});