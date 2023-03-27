import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import MyOrder from 'lowcode-platform-h5-renderer/pages/my-order/index.vue';
import Login from 'lowcode-platform-h5-renderer/pages/login/index.vue';
import Order from 'lowcode-platform-h5-renderer/pages/order/index.vue';
import Address from 'lowcode-platform-h5-renderer/pages/address/index.vue';
import Shop from 'lowcode-platform-h5-renderer/pages/shop/index.vue';
import Commodity from 'lowcode-platform-h5-renderer/pages/commodity/index.vue';
import Home from 'lowcode-platform-h5-renderer/pages/home/index.vue'
import MyInfo from 'lowcode-platform-h5-renderer/pages/my-info/index.vue'
import ShoppingCart from 'lowcode-platform-h5-renderer/pages/shopping-cart/index.vue'

// 路由数组
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'shop',
    redirect: '/home',
    component: Shop,
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
      },
      {
        path: '/info',
        name: 'info',
        component: () => MyInfo,
      },
      {
        path: '/cart',
        name: 'cart',
        component: () => ShoppingCart
      }
    ]
  },
  {
    path: '/commodity',
    name: 'commodity',
    component: () => Commodity,
  },
  {
    path: '/address',
    name: 'address',
    component: () => Address,
  },
  {
    path: '/order',
    name: 'order',
    component: () => Order,
  },
  {
    path: '/my-order',
    name: 'my-order',
    component: () => MyOrder,
  },
  {
    path: '/login',
    name: 'login',
    component: () => Login 
  }
];

// 路由
const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;