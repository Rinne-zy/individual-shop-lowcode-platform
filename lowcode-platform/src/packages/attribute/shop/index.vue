<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <base-attr :simple-control-options="simpleAttr" >
          <el-form-item label="商店标题" v-if="!isUseDefault">
            <el-input 
              v-model="selectedComponent!.propValue.title"
              @change="onHandleChange"
            />
         </el-form-item>
          <el-form-item label="商店图标" v-if="!isUseDefault">
            <el-button @click="handleSelectIcon">点击选择图片</el-button>
         </el-form-item>
         <!-- 图片地址属性 -->
         <el-form-item label="背景图">
          <el-switch class="background-operation" v-model="isUseDefaultBackgroundImage" @change="handleIsUseDefaultBackgroundImageChange" />
          <div v-if="isUseDefaultBackgroundImage">使用默认背景图</div>
          <el-button v-else @click="handleSelectBackground">点击选择图片</el-button>
         </el-form-item>
      </base-attr>
    </el-collapse>
    <select-image-dialog
      :is-visible="isShowSelectImageDialog"
      is-single-select
      @close="isShowSelectImageDialog = false"
      @confirm="handleSelectImage"
    />
  </div>
</template>

<script setup lang="ts">
import { ElCollapse, ElFormItem, ElButton, ElSwitch, ElInput } from 'element-plus';
import { computed,  onMounted, ref } from 'vue';

import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import SelectImageDialog from 'lowcode-platform/components/select-image-dialog/index.vue';
import type { ShopInfoPropValue } from 'lowcode-platform/packages/components/shop/type';
import { BaseControlOption, ControlType } from '../base/type';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import type { Image } from 'lowcode-platform/api/image';

// 图片类型
enum ImageType {
  Icon = 1,
  Background = 2,
}

const schemaStore = useSchemaStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema());
// 激活的 tab
const activeName = ref('style');
let selectImageType: ImageType | null =  null;

// 简单的属性控制
const simpleAttr: Partial<Record<keyof ShopInfoPropValue, BaseControlOption>> = {
  desc: {
    label: '商店描述',
    type: ControlType.Text,
  },
  color: {
    label: '字体颜色',
    type: ControlType.Color,
  },
  useDefault: {
    label: '是否使用部署的商场标题和商城头像',
    type: ControlType.Switch,
  },
};

// 是否展示选择图片的对话框
const isShowSelectImageDialog = ref(false);
// 是否使用默认背景图片
const isUseDefaultBackgroundImage = ref(true);
// 是否使用部署的商城图标和标题
const isUseDefault = computed(() => (selectedComponent.value?.propValue as unknown as ShopInfoPropValue).useDefault);

// 改变是否使用默认的背景图片
const handleIsUseDefaultBackgroundImageChange = (value: string | number | boolean) => {
  if(!!value) {
    (selectedComponent.value?.propValue as unknown as ShopInfoPropValue).background = '';
  }
};
// 选择图片
const handleSelectImage = (image: Image) => {
  isShowSelectImageDialog.value = false;
  if(!selectImageType) return;

  if(selectImageType === ImageType.Icon) {
    (selectedComponent.value?.propValue as unknown as ShopInfoPropValue).icon = image.src;
  } else if (selectImageType === ImageType.Background) {
    (selectedComponent.value?.propValue as unknown as ShopInfoPropValue).background = image.src;
  };
  selectImageType = null;
};
// 选择商店图标
const handleSelectIcon = () => {
  selectImageType = ImageType.Icon;
  isShowSelectImageDialog.value = true;
}
// 选择商店背景图
const handleSelectBackground= () => {
  selectImageType = ImageType.Background;
  isShowSelectImageDialog.value = true;
}
// 处理变化
const onHandleChange = () => {
  // 当属性成功改变并失去焦点时记录快照
  schemaStore.recordSnapshot();
}

onMounted(() => {
  isUseDefaultBackgroundImage.value = !(selectedComponent.value?.propValue as unknown as ShopInfoPropValue).background;
})

</script>

<style lang="scss" scoped src="./index.scss"></style>