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
        <span><van-icon name="star-o" :size="20" />商品收藏<span class="num">12</span></span>
        <span><van-icon name="shop-collect-o" :size="20" />店铺关注<span class="num">5</span></span>
      </div>
      <van-divider>我的订单</van-divider>
      <div class="my-buy-order">
        <van-badge :content="5">
          <div class="my-buy-order-item">
            <van-icon name="credit-pay" :size="30"/>
            <div>待付款</div>
          </div>
        </van-badge>
        <van-badge :content="2">
          <div class="my-buy-order-item ml">
            <van-icon name="logistics" :size="30"/>
            <div>待发货</div>
          </div>
        </van-badge>
        <van-badge>
          <div class="my-buy-order-item ml">
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
}
</script>

<style lang="scss" scoped src="./index.scss"></style>