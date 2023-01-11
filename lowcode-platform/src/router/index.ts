import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import home from 'lowcode-platform/pages/home/index.vue';
import login from 'lowcode-platform/pages/login/index.vue';
import { checkIsLogin } from 'lowcode-platform/hooks/use-login';

// 路由数组
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => home,
    alias: '/home'
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