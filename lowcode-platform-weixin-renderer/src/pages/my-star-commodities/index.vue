<template>
  <nav-bar 
    title="收藏的商品"
    left-arrow
    @click-left="router.go(-1)"
  />
  <view class="commodities">
    <u-swipe-action>
      <u-swipe-action-item
        class="swipe-cell"
        v-for="commodity in starCommodities"
        :key="commodity.id"
        :options="[{
          text: '取消收藏',
          style: {
            backgroundColor: '#f56c6c'
          }
        }]"
        @click="handleCancelStar(commodity.id, commodity.shopId)"
      >
        <view class="commodities-item">
          <view class="commodities-item-avatar">
            <img class="avatar-image" :src="commodity.cover">
          </view>
          <view class="commodities-item-text">
            <view class="commodities-item-title">{{ commodity.name }}</view>
            <view class="commodities-item-desc">{{ commodity.desc }}</view> 
          </view>
          <view class="right-arrow" @click="handleGotoCommodityDetail(commodity.id, commodity.shopId)">
            <van-icon name="arrow" size="20" />
          </view>
        </view>
      </u-swipe-action-item>
    </u-swipe-action>
  </view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

import { checkIsLogin, getUserStarCommoditiesInfo } from 'lowcode-platform-weixin-renderer/api/user';
import type { StarCommodity } from "lowcode-platform-common/type/commodity";
import { useCommodityDetailStore } from 'lowcode-platform-weixin-renderer/store/commodity';
import { starCommodity } from 'lowcode-platform-weixin-renderer/api/commodity';
import { showSuccessToast } from 'lowcode-platform-weixin-renderer/utils/toast';
import { navigateTo } from 'lowcode-platform-weixin-renderer/utils/router';

const router = useRouter();
const starCommodities = ref([] as StarCommodity[]);
const commodityDetailStore = useCommodityDetailStore();

const getStarCommoditiesInfo = async () => {
  const isLogin = await checkIsLogin();
  if(!isLogin) return;
  
  const commodities = await getUserStarCommoditiesInfo();
  starCommodities.value = commodities;
}

// 处理转跳商城逻辑
const handleGotoCommodityDetail = async (commodityId: string, shopId: string) => {
  if(!commodityId || !shopId) return;
  // 设置商品详情展示所需的信息
  commodityDetailStore.commodityId = commodityId;
  commodityDetailStore.shopId = shopId;
  navigateTo('commodity');
};

let isStaring = false;
// 取消收藏
const handleCancelStar = async (commodityId: string, shopId: string) => {
  if(isStaring) return;
  isStaring = true;
  const status = await starCommodity(commodityId, shopId);
  commodityDetailStore.isStar = status;
  showSuccessToast(status ? '收藏成功✔' : '取消收藏');
  await getStarCommoditiesInfo();
  isStaring = false;
}

onShow(async () => {
  getStarCommoditiesInfo();
})
</script>

<style lang="scss" scoped src="./index.scss"></style>