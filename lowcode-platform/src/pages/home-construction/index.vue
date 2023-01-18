<template>
  <div class="construction-panel">
    <!-- 左侧物料区 -->
    <div class="construction-panel-left">
      <components-materials-area 
        @handle-drag-start="handleDragStart"
        @handle-drag-end="dragEnd"
      />
    </div>   
    <!-- 右侧属性控制区 -->
    <div class="construction-panel-right">
      <components-attribute-area/>
    </div>
    <!-- 顶部区 -->
    <div class="construction-panel-top"></div>
    <!-- 画布区域 -->
    <div class="construction-panel-container">
      <div class="construction-panel-container-canvas">
        <div class="construction-panel-container-canvas-content" ref="canvasContentRef">
          <components-editor/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

import componentsAttributeArea from 'lowcode-platform/components/attribute-area/index.vue';
import componentsMaterialsArea from 'lowcode-platform/components/materials-area/index.vue';
import componentsEditor from 'lowcode-platform/components/editor-area/index.vue';
import { useComponentsMaterialDrag } from 'lowcode-platform/hooks/use-drag-hooks';

const canvasContentRef = ref<HTMLElement>();

// 使用拖拽 hooks
const { dragStart, dragEnd } = useComponentsMaterialDrag();
// 拖拽开始
const handleDragStart = (key: string) => {
  dragStart(canvasContentRef as Ref<HTMLElement>, key);
}

</script>

<style src="./index.scss" scoped></style>