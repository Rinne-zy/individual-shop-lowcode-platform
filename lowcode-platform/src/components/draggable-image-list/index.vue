<template>
  <div
    ref="draggableWrapper"
    class="wrapper"
    :style="wrapperStyle"
    @dragend="handleDragEnd"
    @dragover="handleDragOver"
  >
    <!-- 图片列表 -->
    <div 
      class="wrapper-image"
      v-for="(image, index) in images"
      :key="image.id"
      @dragstart="(e) => handleDragStart(e, index)"
      :style="{ marginLeft: getMarinLeftByIndex(index) }"
    >
      <img
       draggable
       :src="image.src"
       :width="width"
       :height="height"
       :data-id="image.id"
      >
      <span 
        class="delete iconfont icon-delete" 
        @click="deleteImage(index)"
      />
      <span v-if="!index" class="wrapper-image-cover">封面</span>
    </div>   
    <!-- 添加图片 -->
    <div 
      v-if="!isMax"
      class="img-placeholder"
      :style="{
        width:`${width}px`,
        marginLeft: getMarinLeftByIndex(images.length)
      }"
      @click="handleAddImage"
    >
      <div class="img-placeholder-icon">
        +
        <span class="img-placeholder-modified">选择图片</span>
      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';

import type { DraggableImage } from 'lowcode-platform/hooks/use-images-drag-hook';
import { useImagesDrag } from 'lowcode-platform/hooks/use-images-drag-hook';
import { swap } from 'lowcode-platform/utils/array';

const props = defineProps({
  modelValue: {
    type: Array as PropType<DraggableImage[]>,
    default: () => [],
  },
  // 图片之间的间隔
  marginLeft: {
    type: Number,
    default: 10,
  },
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
  column: {
    type: Number,
    default: 5,
  },
  maxNumber: {
    type: Number,
    default: 10,
  }
});

const emits = defineEmits(['update:modelValue', 'handleAddImage']);
// 图片列表
const images = computed(() => props.modelValue);

// 容器样式
const wrapperStyle = computed(() => ({
  width: `${props.column * (props.width + props.marginLeft) - props.marginLeft}px`, 
}));
// 处理点击添加图片
const isMax = computed(() => props.modelValue.length >= props.maxNumber);

// 图片属性
const imagesAttribute =  {
  width: props.width,
  height: props.height,
  column: props.column,
  margin: props.marginLeft,
}
// 拖拽开始回调
const dragStartCallback = (e: DragEvent) => {
  (e.target as HTMLElement).classList.add('draggingItem');
};
// 拖拽结束回调
const dragEndCallback = (e: DragEvent) => {
  (e.target as HTMLElement).classList.remove('draggingItem');
};
// 拖拽悬浮回调
const dragOverCallback = (e: DragEvent, draggingIndex: number, currentIndex: number) => {
  swap(images.value, draggingIndex, currentIndex);
  emits('update:modelValue', images.value);
};
// 拖拽
const {
  draggableWrapper,
  handleDragStart,
  handleDragEnd,
  getMarinLeftByIndex,
  handleDragOver,
} = useImagesDrag(
  images.value,
  imagesAttribute,
  {
    dragStartCallback,
    dragEndCallback,
    dragOverCallback,
  }
);

// 处理添加图片
const handleAddImage = () => {
  emits('handleAddImage');
}
// 删除图片
const deleteImage = (index: number) => {
  images.value.splice(index, 1)
  emits('update:modelValue', images.value);
}
</script>

<style lang='scss' scoped src="./index.scss"></style>