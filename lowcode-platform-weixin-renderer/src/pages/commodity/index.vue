<template>
  <view class="commodity">
    <swiper class="commodity-swipe" autoplay :interval="5000" indicator-dots>
      <swiper-item 
        v-for="(image, index) in swipeItemImages"
        :key="index"
      >
        <img style="max-width: 100%;" :src="image" class="commodity-swipe">
      </swiper-item>
    </swiper>
    <view class="commodity-detail">
      <view class="commodity-detail-price">
        <view class="actual-price"><text class="price-symbol">￥</text>{{ actualPrice }}</view>
        <text class="origin-price">￥{{ commodity?.price }}</text>
      </view>
      <view class="commodity-detail-sales-num">已售{{ commodity?.sales }}件</view>
    </view>
    <view class="commodity-tags">
      <view class="tag" v-if="commodity?.discount !== 100 && commodity?.discount !== 0"><u-tag :text="`${discountInfo}折`" plain type="error" /></view>
      <view class="tag"><u-tag text="新品" plain type="error" /></view>
      <view class="tag"><u-tag text="热销" plain type="error" /></view>
    </view>
    <view class="commodity-details">
      <view class="title">商品详情</view>
      <view class="info">
        <view v-html="commodity?.detail"></view>
      </view>
    </view>
    <view class="shop">
      <img class="shop-img" :src="data?.shop.avatar || '/static/cover.png'">
      <view class="shop-info">
        <text class="shop-info-name">{{ data?.shop.name }}</text>
        <text class="shop-info-star">已有{{ data?.shop.starNum }}人关注该店铺</text>
      </view>
      <van-icon class="shop-info-arrow" name="arrow" />
    </view>
    <u-divider v-if="otherPictures.length" text="商品图片展示" />
    <view class="commodity-imgs">
      <img
        class=""
        v-for="(pic, index) in otherPictures"
        :key="index"
        :src="pic"
      >
    </view>
    <view class="padding" />
  </view>
  <commodity-detail-tabbar
    :price="actualPrice"
    @click-shop="handleGotoShop"
    @click-star="handleClickStar"
    @click-cart="handleClickCart"
    @click-buy="handleClickBuy"
  />
  <u-back-top :scroll-top="scrollTop" icon="arrow-up" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';

import CommodityDetailTabbar from 'lowcode-platform-weixin-renderer/components/commodity-tabbar/index.vue';
import { getCommodityDetail, starCommodity } from 'lowcode-platform-weixin-renderer/api/commodity';
import type { CommodityDetail } from 'lowcode-platform-weixin-renderer/api/commodity';
import { useCommodityDetailStore } from 'lowcode-platform-weixin-renderer/store/commodity';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';
import { addCommodityToCart } from 'lowcode-platform-weixin-renderer/api/shopping-cart';
import { useUserStore } from 'lowcode-platform-weixin-renderer/store/user';
import { navigateTo, setRouterConfig, switchTab } from 'lowcode-platform-weixin-renderer/utils/router';
import { showSuccessToast } from 'lowcode-platform-weixin-renderer/utils/toast';

const commodityDetailStore = useCommodityDetailStore();
const userStore = useUserStore();

const data = ref<CommodityDetail>();
const commodity = computed(() => data.value?.commodity);

const scrollTop = ref(0);

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
// 前往商城
const handleGotoShop = async () => {
  const stop = useShopStore();
  stop._id = commodityDetailStore.shopId;
  stop.name = data.value?.shop.name || ''
  await stop.getShop();
  commodityDetailStore.reset();
  // 前往商城
  switchTab('shop');
};
// 判断是否登录
const checkIsLogin = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    setRouterConfig('commodity', false);
    navigateTo('login');
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
  showSuccessToast(status ? '收藏成功' : '取消收藏');
  isStaring = false; 
};
// 点击立即购买
const handleClickBuy = async () => {
  if(!await checkIsLogin()) return;

  await handleClickCart();
  setTimeout(() => {
    switchTab('shopping-cart');
  }, 1000)
};
// 加入购物车
const handleClickCart = async () => {
  if(!await checkIsLogin()) return;

  const { commodityId, shopId } = commodityDetailStore;
  await addCommodityToCart(shopId, commodityId);
}
// 加载数据
onLoad(() => {
  getDetails();
})
// 监听页面滚动
onPageScroll((e: any) => {
  scrollTop.value = e.scrollTop;
})
</script>

<style lang="scss" scoped src="./index.scss"></style>