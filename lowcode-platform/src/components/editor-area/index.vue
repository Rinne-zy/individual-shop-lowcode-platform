<template>
  <shape 
      v-for="(component, index) in components"
      :key="component.id"
      :is-active="component.id === selectedComponentId"
      :id="component.id"
      :commonStyle="component.style"
      :componentStyle="component.componentStyle"
      :isProportion="component.isProportion"
      :class="[ isFixedMode ? 'fixedLayout' : 'sequentialLayout']"
      @on-handle-shape-mouse-down="() => {
        selectComponent(component.id, index);
      }"
    >
      <component
        class="component"
        :is="component.key"
        :prop-value="component.propValue"
        :prop-style="component.style"
      />
  </shape>
  <control-menu/>
  <auxiliary-line/>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ControlMenu from 'lowcode-platform/components/control-menu/index.vue';
import Shape from 'lowcode-platform/components/shape/index.vue';
import AuxiliaryLine from 'lowcode-platform/components/auxiliary-line/index.vue';
import { EditorLayoutMode, useSchemaStore } from 'lowcode-platform/store/schema-store';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';

const editorStatusStore = useEditorStatusStore();
const schemaStore = useSchemaStore();

// 组件 schema
const components = computed(() => schemaStore.schema.components);

// 选中的组件 id
const selectedComponentId = computed(() => editorStatusStore.selectedComponentSchemaId);
const selectComponent = (id: string, index: number) => {
  // 当选择非同一个组件的时候取消菜单
  if(editorStatusStore.selectedComponentSchemaId !== id) {
    editorStatusStore.isShowMenu = false;
  }
  editorStatusStore.selectedComponentSchemaId = id;
  editorStatusStore.selectedComponentIndex = index;
};

// 是否为固定定位
const isFixedMode = computed(() => schemaStore.schema.editor.mode === EditorLayoutMode.Fixed);

</script>

<style scoped src="./index.scss"></style>