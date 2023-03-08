<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <base-attr :simple-control-options="simpleAttr" />
      <el-collapse-item title="图片选择">
        <!-- 真实选择 -->
        <div class="swipe-images" v-for="(swipeItem, index) in swipeItems" :key="index">
            <div class="swipe-images-item">
              <div class="swipe-images-item-img" @click="handleAddImage(index)">
                <img :src="swipeItem.src" width="100" height="100">
                <span class="swipe-images-item-img-modified">更换图片</span>
              </div>       
              <div class="swipe-images-item-operation">
                <span class="swipe-images-item-operation-label">链接设置</span>
                <span class="iconfont icon-up" :class="[!index ? 'disable' : '' ]" @click="handleUpImage(index)"/>
                <span class="iconfont icon-down" :class="[index === (swipeItems.length - 1) ? 'disable' : '' ]" @click="handleDownImage(index)"/>
                <span class="iconfont icon-delete" @click="handleDelete(index)" />
                <el-select class="swipe-images-item-operation-select" />
              </div>
            </div>
        </div>
        <!-- 占位选择图片框 -->
        <div class="swipe-images" v-if="!swipeItems.length">
            <div class="swipe-images-item placeholder">
              <div class="img-placeholder">
                <div class="img-placeholder-icon">
                  +
                  <span class="swipe-images-item-img-modified">选择图片</span>
                </div>
              </div>       
              <div class="swipe-images-item-operation">
                <span class="swipe-images-item-operation-label">链接设置</span>
                <span class="iconfont icon-down" />
                <span class="iconfont icon-up" />
                <span class="iconfont icon-delete" />
                <el-select class="swipe-images-item-operation-select"></el-select>
              </div>
            </div>
            <div style="color: #d40000; margin: 10px">请选择图片</div>
        </div>
        <el-button 
          type="primary"
          style="margin-top: 20px;"
          :disabled="canSelectImage"
          @click="handleAddImage()"
        >
          {{ selectImageButtonText }}
        </el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
  <select-image-dialog 
    :is-visible="isVisible"
    :is-editing="editingIndex !== -1"
    @confirm="handleConfirm"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem, ElSelect, ElButton } from 'element-plus';
import { computed, ComputedRef, PropType, ref } from 'vue';

import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import SelectImageDialog from 'lowcode-platform/components/select-image-dialog/index.vue';
import type { BaseControlOption } from '../base/type';
import { ControlType } from '../base/type';
import type { SwipePropValue } from '@lowcode-platform/packages/src/components/swipe/type';
import { useSchemaStore, ComponentsSchema } from 'lowcode-platform/store/schema-store';
import type { Image } from 'lowcode-platform/api/image';
import { swap } from 'lowcode-platform/utils/array';

const props = defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<SwipePropValue>,
    default: () => {},
  }
})

const schemaStore = useSchemaStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema()) as ComputedRef<ComponentsSchema>;
// 轮播图项
const swipeItems = computed(() => props.propValue.swipeItems);
  // 轮播图最大的图片数目
const maxImagesNumber = 5;
// 选择图片按钮文本
const selectImageButtonText = computed(() => {
  return `点击选择图片（${swipeItems.value.length}/${maxImagesNumber}）`;
});
// 是否可以选择图片
const canSelectImage = computed(() => {
  return swipeItems.value.length >= maxImagesNumber;
});

// 激活的 tab
const activeName = ref('style');

// 简单的属性控制
const simpleAttr: Partial<Record<keyof SwipePropValue, BaseControlOption>> = {
  speed: {
    type: ControlType.Slider,
    label: '轮播速度(秒)',
    options: {
      min: 0,
      max: 10,
      step: 0.5, 
    }
  },
  lazyLoad: {
    type: ControlType.Switch,
    label: '是否使用懒加载',
  }
};

// 选择图片对话框是否可见
const isVisible = ref(false);
// 更换图片的下标
const editingIndex = ref(-1);

// 处理添加图片
const handleAddImage = (index = -1) => {
  isVisible.value = true;
  editingIndex.value = index;
}

// 确认选择图片
const handleConfirm = (selectedImages: Image[] | Image) => {
  const swipeItems = (selectedComponent.value.propValue as unknown as SwipePropValue).swipeItems;
  // 非更改图片情况下添加图片
  if(Array.isArray(selectedImages)) {
    const { length } = swipeItems;
    selectedImages.forEach((image, index) => {
      // 若超过限制数目直接剪枝
      if((length + index + 1) > maxImagesNumber) return;
      swipeItems.push({
        src: image.src,
      });
    })
    isVisible.value = false;
    return;
  }

  // 更改图片情况
  const originEditingImage = swipeItems[editingIndex.value];
  originEditingImage.src = selectedImages.src;
  // 重置
  editingIndex.value = -1;
  isVisible.value = false;
}

// 处理关闭图片对话框
const handleClose = () => {
  isVisible.value = false;
}

// 删除
const handleDelete = (index: number) => {
  const swipeItems = (selectedComponent.value.propValue as unknown as SwipePropValue).swipeItems;
  swipeItems.splice(index, 1);
}

// 处理上移
const handleUpImage = (index: number) => {
  if(!index) return;
  const swipeItems = (selectedComponent.value.propValue as unknown as SwipePropValue).swipeItems;
  swap(swipeItems, index, index - 1);
}

// 处理下移
const handleDownImage = (index: number) => {
  const swipeItems = (selectedComponent.value.propValue as unknown as SwipePropValue).swipeItems;
  if(index === swipeItems.length - 1) return;
  swap(swipeItems, index, index + 1);
}

</script>

<style lang="scss" scoped src="./index.scss"></style>