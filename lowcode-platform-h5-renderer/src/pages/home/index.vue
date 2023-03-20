<template>
  <div>
    <schemaRenderer v-if="isShowShop" />
    <van-empty v-else description="请前往购物车进入其他商城看看吧" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Empty as VanEmpty } from 'vant';

import schemaRenderer from 'lowcode-platform-h5-renderer/components/schema-renderer/index.vue';
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';

const schemaStore = useShopStore();
// 是否展示商城
const isShowShop = computed(() => {
  const query = new URLSearchParams(location.search);
  // 获取 query 中和 store 中的 id 值
  const id = query.get('id');
  return !!(id || schemaStore._id);
})

</script>

<style lang="scss" scoped src="./index.scss"></style>