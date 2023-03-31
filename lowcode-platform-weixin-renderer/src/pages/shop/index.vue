<template>
  <view class="content">
    <schema-renderer />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";

import SchemaRenderer from 'lowcode-platform-weixin-renderer/components/schema-renderer/index.vue';
import { getShopById } from 'lowcode-platform-weixin-renderer/api/shop';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';

const shopStore = useShopStore();

// 初始化
const init = async (id: string) => {
  // 获取 query 中和 store 中的 id 值
  const shopId = id || shopStore._id;
  if(!shopId) return;


  const { _id, name, avatar, schema, commodities  } = await getShopById(shopId);
  if(!_id || !name || !schema) return;

  shopStore.initSchemaStore(_id, name, avatar, schema, commodities);
};

onLoad((options) => {
  if(!options) return;
  init(options.id);
})

</script>

<style>
</style>
