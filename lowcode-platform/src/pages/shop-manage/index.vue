<template>
  <div class="shop-manage" @click="shopsStore.selectShopId = ''">
    <div class="shop-manage-title">我的商城</div>
    <el-divider>⭐</el-divider>
    <div class="shop-manage-list">
      <el-card 
        v-for="(shop, index) in shops"
        :key="shop._id"
        class="shop box-shadow"
        :body-style="{ padding: '0px' }"
        @click="handleClickShop(index)"
      >
      <transition name="router-slid">
        <div class="shop-operation" :style="shop._id === selectShopId ? { display: 'flex' } : {}">
          <div class="checkbox" :class="{selected: shop._id === selectShopId }" @click="handleSelectShop(shop._id, $event)" >
            <span class="iconfont" :class="shop._id === selectShopId ? 'icon-selected': 'icon-not-selected'" />
          </div>
          <div>
            <span class="share-btn" :data-clipboard-text="shop._id"  @click="handleShareShop(shop._id, $event)"><span class="iconfont icon-share-qrcode"/></span>
            <span class="delete-btn" @click="handleDeleteShop(shop._id, $event)"><span class="iconfont icon-delete"/></span>
          </div>
        </div>
      </transition>
        <img :src="shop.avatar" class="shop-image" />
        <div style="padding: 14px">
          <span class="shop-title">{{ shop.name }}</span>
          <div class="shop-bottom">
            <div class="shop-bottom-info">
              <time class="shop-bottom-info-item">最近修改：{{ getDate(shop.devModified) }}</time>
              <time class="shop-bottom-info-item">{{ shop.depModified ? `最近部署：${getDate(shop.depModified)}` : '未部署' }}</time>
              <div class="shop-bottom-info-item">开发版本：v{{ shop.devVersion }}</div>
              <div class="shop-bottom-info-item">{{ shop.depVersion ? `线上版本：v${ shop.depVersion }` : '未部署' }}</div>
            </div>
            <el-button type="primary" text class="shop-bottom-button" @click="handleClickEdit(index, $event)">编辑</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <create-shop-dialog
      ref="createShopDialogRef"
      @cancel="isVisible = false"
      @confirm="handleSaveConfirm"
      :is-visible="isVisible"
    />
    <share-dialog ref="shareDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElButton, ElDivider, ElMessageBox } from 'element-plus';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import CreateShopDialog from 'lowcode-platform/components/create-shop-dialog/index.vue';
import ShareDialog from 'lowcode-platform/components/share-dialog/index.vue';
import { getSchemaById } from 'lowcode-platform/api/schema';
import { StatusCode } from 'lowcode-platform/api/type';
import { getDate } from 'lowcode-platform/utils/time';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { useShopsStore } from 'lowcode-platform/store/shop-store';
import { deleteShop, ShopInfo } from 'lowcode-platform/api/shop';
import { updateShopBasicInfo } from 'lowcode-platform/api/shop';
import { showSuccessMessage } from 'lowcode-platform/utils/toast';

const schemaStore = useSchemaStore();
const router = useRouter();
const shopsStore = useShopsStore();

// 我的商城信息
const shops = computed(() => shopsStore.shops);
const shareDialogRef = ref<InstanceType<typeof ShareDialog>>();
const selectShopId = computed(() =>  shopsStore.selectShopId);
// 商城创建对话框是否可见
const isVisible = ref(false);
// 创建商城对话框
const createShopDialogRef = ref<null | InstanceType<typeof CreateShopDialog> >();
// 正在编辑的商城 id
let isEditingShopId = ''

// 处理点击商城
const handleClickShop = async (index: number) => {
  const { _id, devSchemaId } = shops.value[index];
  const { data } = await getSchemaById(devSchemaId);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  // 初始化 schema store
  schemaStore.init(data.shopSchema.schema, _id);
  router.push('/construction');
}
// 处理编辑
const handleClickEdit = (index: number, e: MouseEvent) => {
  e.stopPropagation();
  const editingShop = shops.value[index];
  createShopDialogRef.value?.setShopForm({
    name: editingShop.name,
    avatar: editingShop.avatar,
  });
  isVisible.value = true;
  isEditingShopId = editingShop._id;
};
// 确认保存
const handleSaveConfirm = async (formData: ShopInfo) => {
  if(!isEditingShopId) return;
  const { data } = await updateShopBasicInfo(isEditingShopId, formData);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  isVisible.value = false;
  isEditingShopId = '';
  shopsStore.getMyShops();
};
// 删除商城
const handleDeleteShop = (id: string, e: MouseEvent) => {
  e.stopPropagation();
  ElMessageBox.confirm(
      '注意：该操作涉及开发中和部署在线上的商城', 
      '是否删除当前商城',
      {
        distinguishCancelAndClose: true,
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        confirmButtonText: '删除',
        cancelButtonText: '取消',
      }
    ).then(async () => {
      const { data } = await deleteShop(id);
      if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
      showSuccessMessage(data.msg);
      shopsStore.getMyShops();
      return true;
    }).catch(() => {
      return false;
    });
}
// 处理选择商城
const handleSelectShop = (id: string, e: MouseEvent) => {
   e.stopPropagation();
   if(id === selectShopId.value) {
    shopsStore.selectShopId = '';
    return;
   };
   shopsStore.selectShopId = id;
};
// 分享商城
const handleShareShop =  async (id: string, e: MouseEvent) => {
  e.stopPropagation();
  shareDialogRef.value?.show(id);
};

shopsStore.getMyShops();

</script>

<style lang="scss" scoped src="./index.scss"></style>