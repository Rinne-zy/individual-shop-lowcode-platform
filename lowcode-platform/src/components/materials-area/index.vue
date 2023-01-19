<template>
 <!-- 滚动  -->
  <div 
    class="components-materials"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <material 
      v-for="component in componentsMaterial"
      class="components-materials-item"
      :icon="component.icon"
      :label="component.label"
      :draggable="true"
      :data-key="component.key"
      />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { initComponentsMaterialStore } from 'lowcode-platform/hooks/use-components-material-init';
import material from '../material/index.vue';

const store = initComponentsMaterialStore()
// 物料
const componentsMaterial = computed(() => store.componentsMaterial);

const emit = defineEmits(['handleDragStart', 'handleDragEnd']);

// 拖拽开始事件
const handleDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('offsetX', `${e.offsetX}`);
  e.dataTransfer?.setData('offsetY', `${e.offsetY}`);

  const { key } = (e.target as HTMLElement).dataset;
  emit('handleDragStart', key);
}

// 拖拽结束事件
const handleDragEnd = () => {
  emit('handleDragEnd');
}

</script>

<style scoped src="./index.scss"></style>