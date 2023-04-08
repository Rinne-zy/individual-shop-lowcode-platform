import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { checkIsLogin } from 'lowcode-platform/hooks/use-login-hook';

const home = () => import('lowcode-platform/pages/home/index.vue');
const login = () => import('lowcode-platform/pages/login/index.vue');
const ShopManage = () => import('lowcode-platform/pages/shop-manage/index.vue');
const PageConstruction = () => import('lowcode-platform/pages/page-construction/index.vue');
const OrderManage = () => import('lowcode-platform/pages/order-manage/index.vue');
const CommodityManage = () => import('lowcode-platform/pages/commodity-manage/index.vue');
const PictureManage = () => import('lowcode-platform/pages/picture-manage/index.vue');

// 路由数组
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    alias: '/home',
    component: home,
    redirect: '/shop',
    children: [
      {
        path: '/shop',
        component: ShopManage,
      },
      {
        path: '/construction',
        component: PageConstruction,
      },
      {
        path: '/order',
        component: OrderManage,
      },
      {
        path: '/picture',
        component: PictureManage,
      },
      {
        path: '/commodity',
        component: CommodityManage,
      }
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: login,
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