<template>
  <div class="shop-manage">
    <el-card 
      v-for="(shop, index) in shops"
      :key="shop._id"
      class="shop box-shadow"
      :body-style="{ padding: '0px' }"
      @click="handleClickShop(index)"
    >
      <img src="/m.png" class="shop-image"/>
      <div style="padding: 14px">
        <span class="shop-title">{{ shop.name }}</span>
        <div class="shop-bottom">
          <time class="shop-bottom-time">最近修改：{{ getDate(shop.modified) }}</time>
          <el-button type="primary" text class="shop-bottom-button" @click="handleClickEdit(shop.name)">编辑</el-button>
        </div>
      </div>
    </el-card>
    <create-shop-dialog
      ref="createShopDialogRef"
      :is-visible="isVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElButton } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import CreateShopDialog from 'lowcode-platform/components/create-shop-dialog/index.vue';
import type { Shop } from 'lowcode-platform/api/schema';
import { getSchema } from 'lowcode-platform/api/schema';
import { StatusCode } from 'lowcode-platform/api/type';
import { getDate } from 'lowcode-platform/utils/time';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';

const schemaStore = useSchemaStore();
const router = useRouter();
const shops = ref<Shop[]>([]);

// 获取用户创建的商城
const getMyShopSchema = async () => {
  const { data } = await getSchema();
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  shops.value = data.shops;
}

getMyShopSchema();

// 处理点击商城
const handleClickShop = (index: number) => {
  const { _id, name, schema } = shops.value[index];
  // 初始化 schema store
  schemaStore.init(schema, _id, name);
  router.push('/construction');
}

// 商城创建对话框是否可见
const isVisible = ref(false);
const createShopDialogRef = ref<null | InstanceType<typeof CreateShopDialog> >();
const handleClickEdit = (name: string) => {
  isVisible.value = true;
  createShopDialogRef.value?.setShopForm(name);
}
</script>

<style lang="scss" scoped src="./index.scss"></style>