<template>
  <div 
    class="components-materials-area"
    @dragstart="handleDragStart"
  >
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        class="components-materials-collapse-item"
        v-for="(value, key) in materialComponents"
        :title="value.title"
        :name="key"
      >
        <div 
          class="components-materials"
          @dragstart="handleDragStart"
        >
          <material 
              v-for="component in value.component"
              class="components-materials-item"
              :icon="component.icon"
              :label="component.label"
              :draggable="draggable"
              :data-key="component.key"
              @click="handleComponentMaterialClick(component.key)"
            />
        </div>       
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElCollapse, ElCollapseItem } from 'element-plus';

import { initComponentsMaterialStore } from 'lowcode-platform/hooks/use-components-material-init-hook';
import Material from '../material/index.vue';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { MaterialType } from 'lowcode-platform/store/material-store';

const store = initComponentsMaterialStore();
const schemaStore = useSchemaStore();

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

const activeName = ref('')

const materialComponents = computed(() => {
  const baseComponentMaterial = store.componentsMaterial.filter((material) => material.type === MaterialType.Base);
  const ECommerceMaterial = store.componentsMaterial.filter((material) => material.type === MaterialType.ECommerce);
  return {
    [MaterialType.Base]: {
      title: '基础组件',
      component: baseComponentMaterial,
    },
    [MaterialType.ECommerce]: {
      title: '电商组件',
      component: ECommerceMaterial,
    }
  }
});


</script>

<style scoped src="./index.scss"></style>