<template>
  <div class="shop" :style="shopInfoStyle">
    <div class="shop-info">
      <img :src="props.propValue.useDefault ? shopStore.avatar : props.propValue.icon" width="60" height="60">
      <div class="shop-info-text" :style="textColor">
        <div class="title">{{ props.propValue.useDefault ? shopStore.name: props.propValue.title }}</div>
        <div class="desc">{{ propValue.desc }}</div>
      </div>
      <div class="star-shop" v-if="!isStar" @click="handleClickStarShop"><van-icon name="like-o" :size="16" />收藏店铺</div>
      <div class="star-shop isStar" v-else @click="handleClickStarShop"><van-icon name="like" :size="16"/>已收藏</div>
      <div class="share-shop" @click="copyShopAddress"><van-icon name="share-o" :size="20"/></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { showSuccessToast, Icon as VanIcon } from 'vant';

import { ShopInfoPropValue } from './type';
import { copy } from 'lowcode-platform-common/utils/copy';
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { useUserStore } from 'lowcode-platform-h5-renderer/store/user';
import { getUserStarShops } from 'lowcode-platform-h5-renderer/api/user';
import { starShop } from 'lowcode-platform-h5-renderer/api/shop';
import router from 'lowcode-platform-h5-renderer/router';

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
  }
});

// 商店信息样式
const shopInfoStyle = {
  backgroundImage: `url(${props.propValue.background || './default.webp'})`,
  height: `${props.propStyle.height}px`,
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
getUserIsStarShop();

// 判断是否登录
const checkIsLogin = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    router.push('/login');
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

// 复制
const copyShopAddress = async () => {
  const url = `http://47.97.34.219:8081/home?id=${shopStore._id}`;
  await copy(url);
  showSuccessToast('复制成功，快去分享吧');
};
</script>

<style lang="scss" scoped src="./index.scss"></style>