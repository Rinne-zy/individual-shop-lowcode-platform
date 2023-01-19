<template>
  <shape 
      v-for="component in components"
      :key="component.id"
      :is-active="component.id === selectedComponentId"
      :style="component.style"
      :class="[ isFixedMode ? 'fixedLayout' : 'sequentialLayout']"
      @on-handle-shape-mouse-down="() => {
        selectComponent(component.id);
      }"
    >
      <component
        class="component"
        :is="component.key"
        :prop-value="component.propValue"
        :prop-style="component.style"
      />
  </shape>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { EditorLayoutMode, useSchemaStore } from 'lowcode-platform/store/schema-store';
import shape from 'lowcode-platform/components/shape/index.vue';

const schemaStore = useSchemaStore();
// 组件 schema
const components = computed(() => schemaStore.schema.components);

// 选中的组件 id
const selectedComponentId = computed(() => schemaStore.selectedComponentSchemaId);
const selectComponent = (id: string) => {
  schemaStore.selectedComponentSchemaId = id;
};

// 是否为固定定位
const isFixedMode = computed(() => schemaStore.schema.editor.mode === EditorLayoutMode.Fixed);

</script>

<style scoped src="./index.scss"></style>