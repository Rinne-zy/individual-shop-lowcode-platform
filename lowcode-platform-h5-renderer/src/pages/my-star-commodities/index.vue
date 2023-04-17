<template>
  <nav-bar 
    title="收藏的商品"
    left-arrow
    @click-left="router.go(-1)"
  />
  <div class="commodities">
    <van-swipe-cell
      class="swipe-cell"
      v-for="commodity in starCommodities"
      :key="commodity.id"
    >
      <div class="commodities-item">
        <div class="commodities-item-avatar">
          <img :src="commodity.cover" width="64" height="64">
        </div>
        <div class="commodities-item-text">
          <div class="commodities-item-title">{{ commodity.name }}</div>
          <div class="commodities-item-desc">{{ commodity.desc }}</div> 
        </div>
        <div class="right-arrow" @click="handleGotoCommodityDetail(commodity.id, commodity.shopId)">
          <van-icon name="arrow" size="20" />
        </div>
      </div>
      <template #right>
        <van-button
          style="height: 100%;"
          square 
          text="取消收藏"
          type="danger"
          class="delete-button"
          @click="handleCancelStar(commodity.id, commodity.shopId)"
        />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script setup lang="ts">
import { NavBar, Icon as VanIcon, SwipeCell as VanSwipeCell, Button as VanButton, showSuccessToast } from 'vant';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

import { getUserStarCommoditiesInfo } from 'lowcode-platform-h5-renderer/api/user';
import type { StarCommodity } from "lowcode-platform-common/type/commodity";
import { useCommodityDetailStore } from 'lowcode-platform-h5-renderer/store/commodity';
import { starCommodity } from 'lowcode-platform-h5-renderer/api/commodity';

const router = useRouter();
const starCommodities = ref([] as StarCommodity[]);
const commodityDetailStore = useCommodityDetailStore();

const getStarCommoditiesInfo = async () => {
  const commodities = await getUserStarCommoditiesInfo();
  starCommodities.value = commodities;
}
getStarCommoditiesInfo();

// 处理转跳商城逻辑
const handleGotoCommodityDetail = async (commodityId: string, shopId: string) => {
  if(!commodityId || !shopId) return;
  // 设置商品详情展示所需的信息
  commodityDetailStore.commodityId = commodityId;
  commodityDetailStore.shopId = shopId;
  router.push('/commodity');
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

</script>

<style lang="scss" scoped src="./index.scss"></style>