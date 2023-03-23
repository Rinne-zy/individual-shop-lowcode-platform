<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { getShopById } from './api/shop';

// schema 存储 store
const shopStore = useShopStore();

// 初始化
const init = async () => {
  const query = new URLSearchParams(location.search);
  // 获取 query 中和 store 中的 id 值
  const id = query.get('id') || shopStore._id;
  if(!id) return;

  const { _id, name, avatar, schema, commodities  } = await getShopById(id);
  if(!_id || !name || !schema) return;

  shopStore.initSchemaStore(_id, name, avatar, schema, commodities);
  document.title = name;
};
init();

</script>

<style scoped></style>