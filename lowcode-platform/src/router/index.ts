import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import home from 'lowcode-platform/pages/home/index.vue';
import login from 'lowcode-platform/pages/login/index.vue';
import homeShop from 'lowcode-platform/pages/home-shop/index.vue';
import homeConstruction from 'lowcode-platform/pages/home-construction/index.vue';
import homeOrder from 'lowcode-platform/pages/home-order/index.vue';
import homeCommodity from 'lowcode-platform/pages/home-commodity/index.vue';
import { checkIsLogin } from 'lowcode-platform/hooks/use-login-hook';

// 路由数组
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    alias: '/home',
    component: () => home,
    redirect: '/shop',
    children: [
      {
        path: '/shop',
        component: () => homeShop,
      },
      {
        path: '/construction',
        component: () => homeConstruction,
      },
      {
        path: '/order',
        component: () => homeOrder,
      },
      {
        path: '/commodity',
        component: () => homeCommodity,
      }
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => login,
    meta: {
      notRequireLogin: true,
    }
  }
];

// 路由
const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

router.beforeEach((to, from, next) => { 
  // 判断是否登录
  if(checkIsLogin()) {
    // 无需登录页面且登录直接跳到主页
    if(to.meta.notRequireLogin) {
      next({
        path: '/home',
      });
    } else {
      // 需要登录页面且登录放行
      next();
    };

    return;
  }

  if (to.path === '/login') next();

  // 未登录必定跳登录页
  next({
    path: '/login',
  });
})

export default router;