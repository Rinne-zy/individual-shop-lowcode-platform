<template>
  <div class="construction-panel">
    <!-- 左侧物料区 -->
    <div class="construction-panel-left">
      <components-materials-area 
        @handle-drag-start="handleDragStart"
      />
      <RealtimeComponents />
    </div>   
    <!-- 右侧属性控制区 -->
    <div class="construction-panel-right">
      <components-attribute-area />
    </div>
    <!-- 画布区域 -->
    <div class="construction-panel-container">
      <div class="construction-panel-container-canvas">
        <operation-menu />
        <div 
          :class="editorClassName" 
          ref="canvasContentRef"
          :style="editorStyle"
          @dragend="dragEnd"
          @mousedown="handleCanvasMouseDown"
          @contextmenu="handleContextMenu"
        >
          <components-editor />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

import ComponentsAttributeArea from 'lowcode-platform/components/attribute-area/index.vue';
import ComponentsMaterialsArea from 'lowcode-platform/components/materials-area/index.vue';
import ComponentsEditor from 'lowcode-platform/components/editor-area/index.vue';
import OperationMenu from 'lowcode-platform/components/operation-menu/index.vue';
import RealtimeComponents from 'lowcode-platform/components/realtime-components/index.vue';
import { useComponentsMaterialDrag } from 'lowcode-platform/hooks/use-drag-hooks';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';

const schemaStore = useSchemaStore();
const editorStatusStore = useEditorStatusStore();
// 画布 DOM
const canvasContentRef = ref<HTMLElement>();
// 编辑器画布类名
const editorClassName = 'construction-panel-container-canvas-content';

// 使用拖拽 hooks
const { dragStart, dragEnd } = useComponentsMaterialDrag(canvasContentRef as Ref<HTMLElement>);
// 拖拽开始
const handleDragStart = (key: string) => {
  dragStart(key);
}

// 编辑器样式
const editorStyle = computed(() => {
  const { width, height } = schemaStore.schema.editor;
  return {
    width,
    height,
  }
})

// 点击画布空白处取消选中
const handleCanvasMouseDown = (e: MouseEvent) => {
  e.stopPropagation();
  editorStatusStore.selectedComponentSchemaId = '';
  editorStatusStore.isShowMenu = false;
}

// 处理右键菜单
const handleContextMenu = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if(!editorStatusStore.selectedComponentSchemaId) return;

  // 计算菜单相对于组件的位移
  let target = (e.target) as HTMLElement;
  let top = e.offsetY;
  let left = e.offsetX;

  // 循环获取距离编辑器的定位
  while (target && !target.className.includes(editorClassName)) {
    left += target.offsetLeft;
    top += target.offsetTop;
    target = (target.parentNode) as HTMLElement;
  };

  editorStatusStore.showMenu(`${left}px`, `${top}px`);
}
</script>

<style src="./index.scss" scoped></style>