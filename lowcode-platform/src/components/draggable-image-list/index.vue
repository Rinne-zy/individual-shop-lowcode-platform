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
import { computed, reactive, ref } from 'vue';
import type { PropType } from 'vue';
import { swap } from 'lowcode-platform/utils/array';

interface DraggableImage {
  // 编号
  id: number;
  // 图片链接
  src: string;
};

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
const images = reactive(props.modelValue);
// 容器样式
const wrapperStyle = computed(() => ({
  width: `${props.column * (props.width + props.marginLeft) - props.marginLeft}px`, 
}));
// 处理点击添加图片
const isMax = computed(() => props.modelValue.length >= props.maxNumber);
// 拖拽的图片索引
const draggingImageIndex = ref<number>(-1);
// 图片容器
const draggableWrapper = ref<HTMLElement>();
// 根据 index 计算 margin 的值
const getMarinLeftByIndex = (index: number) => {
  return index % props.column ? `${ props.marginLeft }px` : 0
}
// 处理拖拽开始
const handleDragStart = (e: DragEvent, imageIndex: number) => {
  draggingImageIndex.value = imageIndex;
  (e.target as HTMLElement).classList.add('draggingItem');
}
// 处理拖拽结束
const handleDragEnd = (e: DragEvent) => {
  (e.target as HTMLElement).classList.remove('draggingItem');
  draggingImageIndex.value = -1;
}
// 处理拖拽
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer!.dropEffect = 'move';
  if(draggingImageIndex.value === -1) return;

  const dropRect = draggableWrapper.value?.getBoundingClientRect();
  if(!dropRect) return;

  const offsetX = e.clientX - dropRect.left;
  const offsetY = e.clientY - dropRect.top;

  // 超出拖动区域
  if (
    offsetX < 0 
    || offsetX > dropRect.width 
    || offsetY < 0
    || offsetY > dropRect.height
  ) {
    return;
  }

  const col = Math.floor(offsetX / (props.width + props.marginLeft));
  const row = Math.floor(offsetY / props.height);
  let currentIndex = row * props.column + col;
  const len = images.length;

  // 避免越界
  if(currentIndex >= len) {
    currentIndex = len - 1;
  }
  // 相同则不需要交换
  if(currentIndex === draggingImageIndex.value) return;

  swap(images, draggingImageIndex.value, currentIndex);
  draggingImageIndex.value = currentIndex;
}
// 处理添加图片
const handleAddImage = () => {
  emits('handleAddImage');
}
// 删除图片
const deleteImage = (index: number) => {
  images.splice(index, 1)
}
</script>

<style lang='scss' scoped src="./index.scss"></style>