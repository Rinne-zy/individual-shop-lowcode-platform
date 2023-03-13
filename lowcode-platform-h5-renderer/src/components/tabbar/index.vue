<template>
  <tabbar 
    v-model="shop.activeTabbar"
    class="tabbar"
    @change="handleTabbarChange"
  >
    <tabbar-item 
      v-for="(value, key) in item"
      :name="value"
      :icon="`${key.toLocaleLowerCase()}-o`"
    >
      {{ labelTextByItem[value] }}
    </tabbar-item>
  </tabbar>
</template>

<script setup lang="ts">
import { Tabbar, TabbarItem } from 'vant';

import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { TabbarItem as item } from 'lowcode-platform-h5-renderer/type/index';
import { useRouter } from 'vue-router';

const shop = useShopStore();
const router  = useRouter();

// 商城文本
const labelTextByItem = {
  [item.Home] : '主页',
  [item.Cart] : '购物车',
  [item.User] : '我的',
}

const handleTabbarChange = (value: string) => {
  router.push(`/${value}`);
}
</script>

<style lang="scss" scoped src="./index.scss"></style>