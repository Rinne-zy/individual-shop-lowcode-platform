<template>
  <div class="commodity">
    <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
      <van-swipe-item 
        v-for="(image, index) in swipeItemImages"
        :key="index"
      >
        <img :src="image" class="commodity-swipe">
      </van-swipe-item>
    </van-swipe>
    <div class="commodity-detail">
      <div class="commodity-detail-price">
        <span class="actual-price"><span class="price-symbol">￥</span>{{ actualPrice }}</span>
        <span class="origin-price">￥{{ commodity?.price }}</span>
      </div>
      <div class="commodity-detail-sales-num">已售{{ commodity?.sales }}件</div>
    </div>
    <div class="commodity-tags">
      <van-tag class="tag" v-if="commodity?.discount !== 100 && commodity?.discount !== 0" plain type="danger">
        {{ discountInfo }}折
      </van-tag>
      <van-tag class="tag" plain type="danger">新品</van-tag>
      <van-tag class="tag" plain type="danger">热销</van-tag>
    </div>
    <div class="commodity-details">
      <div class="title">商品详情</div>
      <div class="info">
        <div v-html="commodity?.detail"></div>
      </div>
    </div>
    <div class="shop">
      <!-- 到时候正式部署的商城 schema 中存在该商城图片头像信息 -->
      <img :src="data?.shop.avatar || '/cover.png'">
      <div class="shop-info">
        <p class="shop-info-name">{{ data?.shop.name }}</p>
        <p class="shop-info-star">已有{{ data?.shop.starNum }}人关注该店铺</p>
      </div>
      <van-icon class="shop-info-arrow" name="arrow" />
    </div>
    <van-divider v-if="otherPictures.length">商品图片展示</van-divider>
    <div class="commodity-imgs">
      <img
        class=""
        v-for="(pic, index) in otherPictures"
        :key="index"
        :src="pic"
      >
    </div>
    <div class="padding" />
  </div>
  <commodity-detail-tabbar
    :price="actualPrice"
    @click-shop="handleGotoShop"
    @click-star="handleClickStar"
    @click-cart="handleClickCart"
    @click-buy="handleClickBuy"
  />
  <van-back-top :bottom="80" :right="15" />
  <div class="back"><van-icon name="arrow-left" @click="handleBack" /></div>
</template>

<script setup lang="ts">
import { 
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
  Tag as VanTag,
  Icon as VanIcon,
  Divider as VanDivider,
  BackTop as VanBackTop,
  showSuccessToast,
} from 'vant';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import CommodityDetailTabbar from 'lowcode-platform-h5-renderer/components/commodity-tabbar/index.vue';
import { getCommodityDetail, starCommodity } from 'lowcode-platform-h5-renderer/api/commodity';
import type { CommodityDetail } from 'lowcode-platform-h5-renderer/api/commodity';
import { useCommodityDetailStore } from 'lowcode-platform-h5-renderer/store/commodity';
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { TabbarItem } from 'lowcode-platform-h5-renderer/type';
import { addCommodityToCart } from 'lowcode-platform-h5-renderer/api/shopping-cart';
import { useUserStore } from 'lowcode-platform-h5-renderer/store/user';

const commodityDetailStore = useCommodityDetailStore();
const userStore = useUserStore();
const router = useRouter();

const data = ref<CommodityDetail>();
const commodity = computed(() => data.value?.commodity);

// 轮播图图片数目
const swipeNum = 3;
// 轮播图图片数据
const swipeItemImages = computed(() => {
  if(!commodity.value) return [];
  return commodity.value.imagesSrc.slice(0, swipeNum);
});
// 真实价格信息
const actualPrice = computed(() => {
  if(!commodity.value) return 0;
  return commodity.value.price * commodity.value.discount * 0.01;
});
// 折扣信息
const discountInfo = computed(() => {
  if(!commodity.value) return 0;
  const info = commodity.value.discount.toString();

  return `${info[0]}.${info[1]}`;
})
// 其余图片数目
const otherPictures = computed(() => {
  if(!commodity.value) return [];
  return commodity.value.imagesSrc.slice(swipeNum, commodity.value.imagesSrc.length);
});

// 获取商品详情信息
const getDetails = async () => {
  if(!commodityDetailStore.shopId || !commodityDetailStore.commodityId) return;
  const res = await getCommodityDetail(commodityDetailStore.shopId, commodityDetailStore.commodityId);
  if(!res) return;
  data.value = res;
};
getDetails();

// 前往商城
const handleGotoShop = async () => {
  const stop = useShopStore();
  stop._id = commodityDetailStore.shopId;
  stop.name = data.value?.shop.name || ''
  await stop.getShop();
  // 前往商城
  stop.activeTabbar = TabbarItem.Home;
  commodityDetailStore.reset();

  router.replace('/');
};

// 判断是否登录
const checkIsLogin = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    router.push('/login');
    return false;
  };
  return isLogin;
}

// 点击收藏
let isStaring = false;
const handleClickStar = async () => {
  if(!await checkIsLogin()) return;

  if(isStaring) return;
  isStaring = true;
  const status = await starCommodity(commodityDetailStore.commodityId, commodityDetailStore.shopId);
  commodityDetailStore.isStar = status;
  showSuccessToast(status ? '收藏成功✔' : '取消收藏');
  isStaring = false; 
};

// 点击立即购买
const handleClickBuy = async () => {
  if(!await checkIsLogin()) return;

  await handleClickCart();
  router.replace('/cart');
};
// 加入购物车
const handleClickCart = async () => {
  if(!await checkIsLogin()) return;

  const { commodityId, shopId } = commodityDetailStore;
  await addCommodityToCart(shopId, commodityId);
}
// 处理返回
const handleBack = () => {
  router.go(-1);
}
</script>

<style lang="scss" scoped src="./index.scss"></style>