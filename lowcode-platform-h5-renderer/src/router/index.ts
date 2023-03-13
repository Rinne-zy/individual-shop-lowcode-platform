import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Home from 'lowcode-platform-h5-renderer/pages/home/index.vue'
import MyInfo from 'lowcode-platform-h5-renderer/pages/my-info/index.vue'
import ShoppingCart from 'lowcode-platform-h5-renderer/pages/shopping-cart/index.vue'

// 路由数组
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    alias: '/home',
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
];

// 路由
const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;