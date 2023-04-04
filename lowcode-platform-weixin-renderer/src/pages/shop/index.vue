<template>
  <view v-if="isShowShop" class="content">
    <schema-renderer />
    <u-back-top :scroll-top="scrollTop" icon="arrow-up" />
  </view>
  <view v-else>
    <u-empty
      mode="data"
      text="快去购物车进入商城吧"
    />
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPageScroll } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

import SchemaRenderer from 'lowcode-platform-weixin-renderer/components/schema-renderer/index.vue';
import { getShopById } from 'lowcode-platform-weixin-renderer/api/shop';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';

const shopStore = useShopStore();
const scrollTop = ref(0);
const isShowShop = computed(() => !!(shopStore._id));

// 初始化
const init = async (id: string) => {
  // 获取 query 中和 store 中的 id 值
  const shopId = id || shopStore._id;
  if(!shopId) return;

  const { _id, name, avatar, schema, commodities  } = await getShopById(shopId);
  if(!_id || !name || !schema) return;

  shopStore.initSchemaStore(_id, name, avatar, schema, commodities);
};

onPageScroll((e: any) => {
  scrollTop.value = e.scrollTop;
})

onLoad((options) => {
  if(!options) return;
  init(options.id);
})

</script>

<style>
</style>
