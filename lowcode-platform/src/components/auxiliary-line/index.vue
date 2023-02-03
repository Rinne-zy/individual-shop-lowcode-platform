<template>
  <div class="auxiliary-line">
    <div
      v-for="(line, key) in lines"
      v-show="line.isShow && isMovingComponent"
      :key="key"
      :style="line.style"
      class="line"
      :class="key.includes('x') ? 'x-line' : 'y-line'"
    />
    <div 
      class="line mid-line y-line" 
      v-show="isMovingComponent && isCanvasMidLineShow"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';
import { computed } from 'vue';

const editorStatusStore = useEditorStatusStore();

const lines = computed(() => editorStatusStore.lineStatus);
const isMovingComponent = computed(() => editorStatusStore.isMovingComponent);
const isCanvasMidLineShow = computed(() => editorStatusStore.isShowCanvasMidLine);

</script>

<style src="./index.scss" scoped></style>