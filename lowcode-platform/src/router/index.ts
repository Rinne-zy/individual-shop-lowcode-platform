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
      notRequireAuth: true,
    }
  }
];

// 路由
const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

router.beforeEach((to, from, next) => { 
  // 已登录
  if(to.meta.notRequireAuth || checkIsLogin()) {
    next();
    return;
  }

  // 需要登录的页面未登录
  next({
    path: '/login',
  });
})

export default router;