<template>
   <div v-show="isShowMenu" class="control-menu" :style="menuPositionStyle">
      <!-- 阻止冒泡，放置先触发 onMouseDown -->
      <ul @mousedown="(e) => e.stopPropagation()">
          <template v-if="isSelectedComponent">
            <li @click="deleteComponent">删除</li>
            <template v-if="isFixedMode">
              <li @click="upComponent">上浮</li>
              <li @click="downComponent">下沉</li>
            </template>
            <template v-else>
              <li @click="downComponent">上移</li>
              <li @click="upComponent">下移</li>
            </template>        
          </template>
      </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';

const editorStatusStore = useEditorStatusStore();
const schemaStore = useSchemaStore();

// 是否显示菜单
const isShowMenu = computed(() => editorStatusStore.isShowMenu);
// 菜单位置
const menuPositionStyle = computed(() => editorStatusStore.menuPosition);
// 是否选择组件
const isSelectedComponent = computed(() => editorStatusStore.selectedComponentSchemaId);
// 是否为固定布局
const isFixedMode = computed(() => schemaStore.isFixLayoutMode());

// 删除组件
const deleteComponent = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  schemaStore.deleteComponentSchemaByIndex(editorStatusStore.selectedComponentIndex);
  editorStatusStore.resetStoreState();
  schemaStore.recordSnapshot();
};

// 上移组件
const upComponent = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  schemaStore.upComponent();
  editorStatusStore.isShowMenu = false;
  schemaStore.recordSnapshot();
};

// 下移组件
const downComponent = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  schemaStore.downComponent();
  editorStatusStore.isShowMenu = false;
  schemaStore.recordSnapshot();
};
</script>

<style src="./index.scss" scoped></style>