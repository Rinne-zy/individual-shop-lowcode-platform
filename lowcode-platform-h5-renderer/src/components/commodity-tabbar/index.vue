<template>
  <div class="commodity-tabbar">
   <div style="display: flex;">
      <div class="commodity-tabbar-item" @click="handleClickShop">
        <van-icon name="shop-o" :size="20" />
        <div class="text">店铺</div>
      </div>
      <div class="commodity-tabbar-item" @click="handleClickStar">
        <van-icon v-if="!isStar" name="star-o" :size="20" />
        <van-icon v-else name="star" :size="20" color="#ffb800"/>
        <div class="text">收藏</div>
      </div>
   </div>
    <div style="display: flex;">
      <div class="commodity-tabbar-item commodity-tabbar-cart" @click="handleClickCart">
        <van-icon name="cart-o" :size="20"  />
        <div class="text">加入购物车</div>
      </div>
      <div class="commodity-tabbar-item commodity-tabbar-buy" @click="handleClickBuy">
        <div><van-icon name="balance-o" />{{ price }}</div>
        <div class="text">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon as VanIcon } from 'vant';
import { computed } from 'vue';

import { useCommodityDetailStore } from 'lowcode-platform-h5-renderer/store/commodity';
import { getUserStarCommodities } from 'lowcode-platform-h5-renderer/api/user';
import { useUserStore } from 'lowcode-platform-h5-renderer/store/user';
import { useRouter } from 'vue-router';

defineProps({
  price: {
    type: Number,
    default: 0
  }
});

const emits = defineEmits(['clickShop', 'clickStar', 'clickBuy', 'clickCart']);

const commodityDetailStore = useCommodityDetailStore(); 
const userStore = useUserStore();
const router = useRouter();

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
  commodityDetailStore.isStar = commodities[commodityDetailStore.commodityId];
  canClickStarBtn = true;
};
getUserIsStarCommodity();

// 判断是否登录
const checkIsLogin = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    router.push('/login');
    return false;
  };
  return isLogin;
}
// 点击商城
const handleClickShop = () => {
  emits('clickShop');
};
// 点击收藏
const handleClickStar = async () => {
  if(!await checkIsLogin()) return 
  if(!canClickStarBtn) return;
  emits('clickStar');
}
// 点击购买
const handleClickBuy = async () => {
  if(!await checkIsLogin()) return 
  emits('clickBuy');
}
// 点击加入购物车
const handleClickCart = async () => {
  if(!await checkIsLogin()) return 
  emits('clickCart');
}
</script>

<style lang="scss" scoped src="./index.scss"></style>