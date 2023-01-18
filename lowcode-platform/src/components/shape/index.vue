<template>
 <div
    :class="['shape', isActive ? 'active' : '']"
    ref='shapeRef'
  >
    <div
      v-for="item in (isActive ? points : [])"
      :key="item"
      class="shape-point"
      :style="getPointPositionStyle(item)"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { usePointsShape } from 'lowcode-platform/hooks/use-shape-ponits';

defineProps({
  isActive:{
    type: Boolean,
    default: false,
  }
});

// 启用控制点
const {
  points,
  shapeRef,
  getNowCursor,
  getPointPositionStyle,
} = usePointsShape();
</script>

<style scoped src="./index.scss"></style>