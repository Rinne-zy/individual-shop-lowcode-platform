<template>
  <div class="realtime">
    <div
        v-for="(component, index) in components"
        :key="component.id"
        class="realtime-component"
        :class="{ actived: component.id === curComponentId }"
        @click="selectComponent(component.id, index)"
    >
      <span class="packageIcon" :class="`icon-${component.key.toLocaleLowerCase()}`" />
      <span>{{ component.componentName }}</span>
      <div class="operation">
        <span class="iconfont icon-up" @click="downComponent(component.id, index)" />
        <span class="iconfont icon-down" @click="upComponent(component.id, index)" />
        <span class="iconfont icon-delete" @click="deleteComponent(index)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';

const schemaStore = useSchemaStore();
const editorStatusStore = useEditorStatusStore();

const components = computed(() => schemaStore.schema.components);
const curComponentId = computed(() => editorStatusStore.selectedComponentSchemaId);

// 选择组件
const selectComponent = (id: string, index: number) => {
  editorStatusStore.selectedComponentIndex = index;
  editorStatusStore.selectedComponentSchemaId = id;
}

// 上移组件
const upComponent = (id: string, index: number) => {
  schemaStore.upComponent(index);
  editorStatusStore.selectedComponentSchemaId = id;
  schemaStore.recordSnapshot();
}

// 下移组件
const downComponent = (id: string, index: number) => {
  schemaStore.downComponent(index);
  editorStatusStore.selectedComponentSchemaId = id;
  schemaStore.recordSnapshot();
}

// 删除组件
const deleteComponent = (index: number) => {
  schemaStore.deleteComponentSchemaByIndex(index);
  editorStatusStore.resetStoreState();
  schemaStore.recordSnapshot();
}
</script>

<style src="./index.scss" scoped></style>