<template>
  <view class="my">
    <view class="my-info">
      <img
        class="my-info-avatar"
        :src="avatar || '/static/no-login.png'" 
      />
      <view class="my-info-name" :class="{ notLogin: !isLogin }">{{ isLogin ? username : '未登录' }}</view>
      <view class="logout" @click="handleLogin">
        {{ isLogin ? '注销' : '登录/注册' }}
        <van-icon name="arrow" />
      </view>
    </view>
    <view class="my-buy">
      <view class="my-buy-like">
        <view @click="goToMyStarCommodities"><van-icon name="star-o" :size="20" />商品收藏<text class="num">{{ userStore.starCommodities.length }}</text></view>
        <view @click="goToMyStarShops"><van-icon name="shop-collect-o" :size="20" />店铺关注<text class="num">{{ userStore.starShops.length }}</text></view>
      </view>
      <u-divider text="我的订单"></u-divider>
      <view class="my-buy-order">
        <view class="my-buy-order-item">
          <view class="item-badge"><u-badge max="99" :value="userStore.payingOrderNumber" /></view>
          <van-icon name="credit-pay" :size="30" @click="handleGotoMyOrder(OrderFormType.Paying)"/>
          <view>待付款</view>
        </view>
        <view class="my-buy-order-item ml">
          <view class="item-badge"><u-badge max="99" :value="userStore.preparingOrderNumber" /></view>
          <van-icon name="send-gift-o" :size="30" @click="handleGotoMyOrder(OrderFormType.Preparing)"/>
          <view>待发货</view>
        </view>
        <view class="my-buy-order-item ml">
          <view class="item-badge"><u-badge max="99" :value="userStore.deliveringOrderNumber" /></view>
          <van-icon name="logistics" :size="30" @click="handleGotoMyOrder(OrderFormType.Delivering)"/>
          <view>已发货</view>
        </view>
        <view class="my-buy-order-item ml" @click="handleGotoMyOrder(OrderFormType.All)">
          <van-icon name="orders-o" :size="30"/>
          <view>全部订单</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useUserStore } from 'lowcode-platform-weixin-renderer/store/user';
import { OrderFormType, useOrderStore } from 'lowcode-platform-weixin-renderer/store/order';
import { checkIsLogin, getUserStarInfo } from 'lowcode-platform-weixin-renderer/api/user';
import { getOrderFormTypeNumber } from 'lowcode-platform-weixin-renderer/api/order';
import { onShow } from '@dcloudio/uni-app';
import { navigateTo, setRouterConfig } from 'lowcode-platform-weixin-renderer/utils/router';

const userStore = useUserStore();
// 用户名
const username = computed(() => userStore.username);
// 用户头像
const avatar = computed(() => userStore.avatar);
// 是否登录
const isLogin = computed(() => userStore.isLogin);

// 处理点击登录相关操作
const handleLogin = () => {
  // 未登录转调至登录界面
  if(!isLogin.value) {
    setRouterConfig('my-info', true);
    navigateTo('login');
    return;
  };

  // 注销登录
  userStore.clearLoginUserInfo();
};

// 处理前往订单
const handleGotoMyOrder = (type: OrderFormType) => {
  const orderStore = useOrderStore();
  orderStore.activeTab = type;
  navigateTo('my-order');
};

// 获取用户收藏信息
const getStarInfo = async () => {
  if(!isLogin.value) return;
  const { shops, commodities} = await getUserStarInfo();
  userStore.starShops = shops;
  userStore.starCommodities = commodities;
};

// 获取用户订单类型
const getOrderInfo = async () => {
  if(!isLogin.value) return;
  const { paying, preparing, delivering } = await getOrderFormTypeNumber();
  userStore.payingOrderNumber = paying;
  userStore.preparingOrderNumber = preparing;
  userStore.deliveringOrderNumber = delivering;
}

// 前往我收藏的商品
const goToMyStarCommodities = () => {
  navigateTo('my-star-commodities');
}
// 前往我收藏的店铺
const goToMyStarShops = () => {
  navigateTo('my-star-shops');
}

onShow(async () => {
  const isLogin = await checkIsLogin();
  if(!isLogin) return;

  getOrderInfo();
  getStarInfo();
});

</script>

<style lang="scss" scoped src="./index.scss"></style>