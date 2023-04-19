<template>
  <view class="commodity-tabbar">
   <view style="display: flex;">
      <view class="commodity-tabbar-item" @click="handleClickShop">
        <van-icon name="shop-o" :size="20" />
        <view class="text">店铺</view>
      </view>
      <view class="commodity-tabbar-item" @click="handleClickStar">
        <van-icon v-if="!isStar" name="star-o" :size="20" />
        <van-icon v-else name="star" :size="20" color="#ffb800"/>
        <view class="text">收藏</view>
      </view>
   </view>
    <view style="display: flex;">
      <view class="commodity-tabbar-item commodity-tabbar-cart" @click="handleClickCart">
        <van-icon name="cart-o" :size="20"  />
        <view class="text">加入购物车</view>
      </view>
      <view class="commodity-tabbar-item commodity-tabbar-buy" @click="handleClickBuy">
        <view><van-icon name="balance-o" />{{ price }}</view>
        <view class="text">立即购买</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useCommodityDetailStore } from 'lowcode-platform-weixin-renderer/store/commodity';
import { getUserStarCommodities } from 'lowcode-platform-weixin-renderer/api/user';
import { useUserStore } from 'lowcode-platform-weixin-renderer/store/user';

defineProps({
  price: {
    type: Number,
    default: 0
  }
});

const emits = defineEmits(['clickShop', 'clickStar', 'clickBuy', 'clickCart']);

const commodityDetailStore = useCommodityDetailStore(); 
const userStore = useUserStore();

// 是否收藏商品
const isStar = computed(() => commodityDetailStore.isStar);
// 是否能够点击商品
let canClickStarBtn = false;

// 获取用户是否收藏了该商品
const getUserIsStarCommodity = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    canClickStarBtn = true;
    return
  };

  const commodities = await getUserStarCommodities();
  const id = `${commodityDetailStore.commodityId}-${commodityDetailStore.shopId}`;
  // 判断是否收藏了
  commodityDetailStore.isStar = (commodities.findIndex((csId) => csId === id) !== -1);
  canClickStarBtn = true;
};
getUserIsStarCommodity();

// 点击商城
const handleClickShop = () => {
  emits('clickShop');
};
// 点击收藏
const handleClickStar = async () => {
  if(!canClickStarBtn) return;
  emits('clickStar');
}
// 点击购买
const handleClickBuy = async () => {
  emits('clickBuy');
}
// 点击加入购物车
const handleClickCart = async () => {
  emits('clickCart');
}
</script>

<style lang="scss" scoped src="./index.scss"></style>