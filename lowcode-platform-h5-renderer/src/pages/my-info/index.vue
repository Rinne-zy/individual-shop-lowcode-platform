<template>
  <div class="my">
    <div class="my-info">
      <van-image
        round
        width="80"
        height="80"
        :src="avatar || '/no-login.png'" 
      />
      <div class="my-info-name" :class="{ notLogin: !isLogin }">{{ isLogin ? username : '未登录' }}</div>
      <div class="logout" @click="handleLogin">
        {{ isLogin ? '注销' : '登录/注册' }}
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="my-buy">
      <div class="my-buy-like">
        <span @click="goToMyStarCommodities"><van-icon name="star-o" :size="20" />商品收藏<span class="num">{{ userStore.starCommodities.length }}</span></span>
        <span @click="goToMyStarShops"><van-icon name="shop-collect-o" :size="20" />店铺关注<span class="num">{{ userStore.starShops.length }}</span></span>
      </div>
      <van-divider>我的订单</van-divider>
      <div class="my-buy-order">
        <van-badge :content="userStore.payingOrderNumber">
          <div class="my-buy-order-item">
            <van-icon name="credit-pay" :size="30" @click="handleGotoMyOrder(OrderFormType.Paying)"/>
            <div>待付款</div>
          </div>
        </van-badge>
        <van-badge :content="userStore.preparingOrderNumber">
          <div class="my-buy-order-item ml">
            <van-icon name="send-gift-o" :size="30" @click="handleGotoMyOrder(OrderFormType.Preparing)"/>
            <div>待发货</div>
          </div>
        </van-badge>
        <van-badge :content="userStore.deliveringOrderNumber">
          <div class="my-buy-order-item ml">
            <van-icon name="logistics" :size="30" @click="handleGotoMyOrder(OrderFormType.Delivering)"/>
            <div>已发货</div>
          </div>
        </van-badge>
        <van-badge>
          <div class="my-buy-order-item ml" @click="handleGotoMyOrder(OrderFormType.All)">
            <van-icon name="orders-o" :size="30"/>
            <div>全部订单</div>
          </div>
        </van-badge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Image as VanImage, Icon as VanIcon, Divider as VanDivider, Badge as VanBadge } from 'vant';
import { computed } from 'vue';

import { useUserStore } from 'lowcode-platform-h5-renderer/store/user';
import { useRouter } from 'vue-router';
import { OrderFormType, useOrderStore } from 'lowcode-platform-h5-renderer/store/order';
import { getUserStarInfo } from 'lowcode-platform-h5-renderer/api/user';
import { getOrderFormTypeNumber } from 'lowcode-platform-h5-renderer/api/order';

const router = useRouter();
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
    router.push('/login');
    return;
  };

  // 注销登录
  userStore.clearLoginUserInfo();
};

// 处理前往订单
const handleGotoMyOrder = (type: OrderFormType) => {
  const orderStore = useOrderStore();
  orderStore.activeTab = type;
  router.push('/my-order')
};

// 获取用户收藏信息
const getStarInfo = async () => {
  if(!isLogin.value) return;
  const { shops, commodities} = await getUserStarInfo();
  userStore.starShops = shops;
  userStore.starCommodities = commodities;
};
getStarInfo();

// 获取用户订单类型
const getOrderInfo = async () => {
  if(!isLogin.value) return;
  const { paying, preparing, delivering } = await getOrderFormTypeNumber();
  userStore.payingOrderNumber = paying;
  userStore.preparingOrderNumber = preparing;
  userStore.deliveringOrderNumber = delivering;
}
getOrderInfo();

// 前往我的收藏店铺
const goToMyStarShops = () => {
  router.push('/star-shops');
}

// 前往我的收藏店铺
const goToMyStarCommodities = () => {
  router.push('/star-commodities');
}
</script>

<style lang="scss" scoped src="./index.scss"></style>