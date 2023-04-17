<template>
  <nav-bar 
    title="收藏的商城"
    left-arrow
    @click-left="router.go(-1)"
  />
  <div class="shops">
    <div 
      v-for="info in starShops"
      :key="info._id"
      class="shops-item"
      @click="handleGotoShop(info.name, info._id)"
    >
      <div class="shops-item-avatar">
        <img :src="info.avatar" width="64" height="64">
      </div>
      <div class="shops-item-text">
        <div class="shops-item-title">{{ info.name }}</div>
        <div class="shops-item-star-num">已经有{{ info.starNum }}个人收藏该商城</div>
      </div>
      <div class="right-arrow">
        <van-icon name="arrow" size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavBar, Icon as VanIcon } from 'vant';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

import { getUserStarShopsInfo } from 'lowcode-platform-h5-renderer/api/user';
import type { Shop } from "lowcode-platform-common/type/shop";
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { TabbarItem } from 'lowcode-platform-h5-renderer/type';

const router = useRouter();
const starShops = ref([] as Shop[])

const getStarShopsInfo = async () => {
  const shops = await getUserStarShopsInfo();
  starShops.value = shops;
}
getStarShopsInfo();

// 处理转跳商城逻辑
const handleGotoShop = async (name: string, id: string) =>{
  const stop = useShopStore();
  stop.name = name;
  stop._id = id;
  await stop.getShop();

  // 前往商城
  stop.activeTabbar = TabbarItem.Home;
  router.push('/');
};

</script>

<style lang="scss" scoped src="./index.scss"></style>