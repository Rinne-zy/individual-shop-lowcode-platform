<template>
  <view class="shop" :style="shopInfoStyle">
    <view class="shop-info">
      <img class="shop-img" :src="props.propValue.useDefault ? shopStore.avatar : props.propValue.icon" width="60" height="60">
      <view class="shop-info-text" :style="textColor">
        <view class="title">{{ props.propValue.useDefault ? shopStore.name: props.propValue.title }}</view>
        <view class="desc">{{ propValue.desc }}</view>
      </view>
      <view class="star-shop" v-if="!isStar" @click="handleClickStarShop"><van-icon name="like-o" :size="16" />收藏店铺</view>
      <view class="star-shop isStar" v-else @click="handleClickStarShop"><van-icon name="like" :size="16"/>已收藏</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';

import type { ShopInfoPropValue } from './type';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';
import { useUserStore } from 'lowcode-platform-weixin-renderer/store/user';
import { getUserStarShops } from 'lowcode-platform-weixin-renderer/api/user';
import { starShop } from 'lowcode-platform-weixin-renderer/api/shop';
import { onShow } from '@dcloudio/uni-app';
import { transformPxToVw } from 'lowcode-platform-common/utils/style';

const shopStore = useShopStore();
const userStore = useUserStore();

const props = defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<ShopInfoPropValue>,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  },
});

// 商店信息样式
const shopInfoStyle = {
  backgroundImage: `url(${props.propValue.background || 'http://47.97.34.219/images/default.webp'})`,
};
// 文本颜色
const textColor = {
  color: props.propValue.color
};
// 是否收藏店铺
const isStar = ref(false);
// 是否能点击按钮
let canClickStarBtn = false;
// 获取用户是否收藏
const getUserIsStarShop = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    canClickStarBtn = true;
    return;
  }

  const shop = await getUserStarShops();
  isStar.value = shop[shopStore._id];
  canClickStarBtn = true;
};

// 判断是否登录
const checkIsLogin = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    return false;
  };
  return isLogin;
}

// 收藏店铺
const handleClickStarShop = async () => {
  if(!await checkIsLogin()) return;

  if(!canClickStarBtn) return
  canClickStarBtn = false;
  isStar.value = await starShop(shopStore._id);
  canClickStarBtn = true;
};

onShow(() => {
  getUserIsStarShop();
})

getUserIsStarShop();

</script>

<style lang="scss" scoped src="./index.scss"></style>