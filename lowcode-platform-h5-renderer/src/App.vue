<template>
  <div>
    H5 渲染器
  </div>
</template>

<script setup lang="ts">
import { getSchemaById } from 'lowcode-platform-h5-renderer/api/get-schema';
import { useSchemaStore } from 'lowcode-platform-h5-renderer/store/schema';

// schema 存储 store
const schemaStore = useSchemaStore();

// 初始化
const init = async () => {
  const query = new URLSearchParams(location.search);
  const id = query.get('id');
  if(!id) return;

  const { _id, name, schema } = await getSchemaById(id);
  if(!_id || !name || !schema) return;

  schemaStore.initSchemaStore(_id, name, schema);
  document.title = name;
};
init();

</script>

<style scoped></style>