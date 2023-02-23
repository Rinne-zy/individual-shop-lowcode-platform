<template>
  <div 
    class="components-materials"
    @dragstart="handleDragStart"
  >
    <material 
      v-for="component in componentsMaterial"
      class="components-materials-item"
      :icon="component.icon"
      :label="component.label"
      :draggable="draggable"
      :data-key="component.key"
      @click="handleComponentMaterialClick(component.key)"
      />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { initComponentsMaterialStore } from 'lowcode-platform/hooks/use-components-material-init-hook';
import Material from '../material/index.vue';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';

const store = initComponentsMaterialStore();
const schemaStore = useSchemaStore();

// 物料
const componentsMaterial = computed(() => store.componentsMaterial);
// 是否可拖拽
const draggable = computed(() => schemaStore.isFixLayoutMode());

const emit = defineEmits(['handleDragStart', 'handleComponentMaterialClick']);

// 拖拽开始事件
const handleDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('offsetX', `${e.offsetX}`);
  e.dataTransfer?.setData('offsetY', `${e.offsetY}`);

  const { key } = (e.target as HTMLElement).dataset;
  emit('handleDragStart', key);
}

// 处理物料区点击
const handleComponentMaterialClick = (key: string) => {
  if(draggable.value || !key) return;
  emit('handleComponentMaterialClick', key);
}

</script>

<style scoped src="./index.scss"></style>