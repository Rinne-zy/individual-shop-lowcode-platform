<template>
  <view class="shops">
    <view 
      v-for="info in starShops"
      :key="info._id"
      class="shops-item"
      @click="handleGotoShop(info.name, info._id)"
    >
      <view class="shops-item-avatar">
        <img class="avatar-image" :src="info.avatar" width="64" height="64">
      </view>
      <view class="shops-item-text">
        <view class="shops-item-title">{{ info.name }}</view>
        <view class="shops-item-star-num">已经有{{ info.starNum }}个人收藏该商城</view>
      </view>
      <view class="right-arrow">
        <van-icon name="arrow" size="20" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

import { checkIsLogin, getUserStarShopsInfo } from 'lowcode-platform-weixin-renderer/api/user';
import type { Shop } from "lowcode-platform-common/type/shop";
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';
import { switchTab } from 'lowcode-platform-weixin-renderer/utils/router';

const starShops = ref([] as Shop[])

const getStarShopsInfo = async () => {
  const isLogin = await checkIsLogin();
  if(!isLogin) return;
  
  const shops = await getUserStarShopsInfo();
  starShops.value = shops;
}

// 处理转跳商城逻辑
const handleGotoShop = async (name: string, id: string) =>{
  const stop = useShopStore();
  stop.name = name;
  stop._id = id;
  await stop.getShop();
  switchTab('shop');
};

onShow(async () => {
  getStarShopsInfo();
})

</script>

<style lang="scss" scoped src="./index.scss"></style>