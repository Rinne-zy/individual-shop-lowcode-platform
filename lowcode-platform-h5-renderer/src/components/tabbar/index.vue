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
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { TabbarItem as item } from 'lowcode-platform-h5-renderer/type/index';

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
};

// 根据路径名称获取对应的 item
const tabbarItemByPathName:Record<string, item> = {
  'home': item.Home,
  'cart': item.Cart,
  'info': item.User,
}

onMounted(() => {
  const path = location.pathname.split('/')[1];
  const tabbarItem = tabbarItemByPathName[path];
  if(!tabbarItem) return;
  shop.activeTabbar = tabbarItem;
})

</script>

<style lang="scss" scoped src="./index.scss"></style>