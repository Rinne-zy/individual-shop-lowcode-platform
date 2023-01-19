<template>
 <div
    :class="['shape', isActive ? 'active' : '']"
    ref='shapeRef'
    draggable="false"
    @mousedown="handleMouseDown"
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
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { transformPxToNumber } from 'lowcode-platform/utils/position';

const schemaStore = useSchemaStore();

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

const emits = defineEmits(['onHandleShapeMouseDown']);

// 按下鼠标事件，用于拖动组件
const handleMouseDown = (e: MouseEvent) => {
  e.stopPropagation();
  emits('onHandleShapeMouseDown');
  const schema = schemaStore.getSelectedComponentSchema();
  if(!schema) return;

  // 按下位置的屏幕坐标
  const startY = e.clientY;
  const startX = e.clientX;
  // 按下鼠标时的定位
  const startLeft = transformPxToNumber(schema.style.left);
  const startTop = transformPxToNumber(schema.style.top);

  // 按下并鼠标移动
  const mouseMove = (e: MouseEvent) => {
    const offsetX = e.clientX - startX;
    const offsetY = e.clientY - startY;
    schemaStore.updatedComponentSchemaStyleById(schemaStore.selectedComponentSchemaId, {
      // 利用屏幕坐标偏移进行计算
      left: `${startLeft + offsetX}px`,
      top: `${startTop + offsetY}px`,
    } as CSSStyleDeclaration)
  }

  // 鼠标抬起
  const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
  }

  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
}
</script>

<style scoped src="./index.scss"></style>