<template>
 <div
    :class="['shape', isActive ? 'active' : '']"
    :style="style"
    ref='shapeRef'
    draggable="false"
    @mousedown="handleMouseDown"
  >
    <span v-show="isActive" class="iconfont icon-rotate" @mousedown="handleRotate"/>
    <div v-if="isUpdateShapePoint">
      <div 
        v-for="item in (isActive ? points : [])"
        :key="item"
        class="shape-point"
        :style="getPointPositionStyle(item)"
        @mousedown="handlePointMouseDown(item, $event)"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { Ref } from 'vue';

import { usePointsShape, shapePointsUpdateById } from 'lowcode-platform/hooks/use-shape-points';
import type { Points } from 'lowcode-platform/hooks/use-shape-points';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { transformPxToNumber, getRotateDeg } from 'lowcode-platform/utils/unit';
import { handleScaleTransform } from 'lowcode-platform/utils/translate';
import { calcOffsetPosition, isPositionOutOfCanvasRight } from 'lowcode-platform/utils/position';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';

const schemaStore = useSchemaStore();
const editorStatusStore = useEditorStatusStore();

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isProportion: {
    type: Boolean,
    default: false,
  },
  commonStyle: {
    type: Object,
    default: () => {}
  },
  componentStyle: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits(['onHandleShapeMouseDown']);

// 组件样式
const style = computed(() => {
  const commonStyle: Record<string, string> = {};
  Object.keys((props.commonStyle)).forEach((key) => {
    commonStyle[key] = `${props.commonStyle[key]}px`;
  })

  return {
    ...commonStyle,
    rotate: `${props.commonStyle.rotate}deg`,
    ...props.componentStyle,
  }
})

// 强制更新控制点
const isUpdateShapePoint = ref(true);
shapePointsUpdateById[props.id] = () => {
  isUpdateShapePoint.value = false;
  nextTick(() => {
    isUpdateShapePoint.value= true;
  })
};

// 启用控制点
const {
  points,
  shapeRef,
  getNowCursor,
  getPointPositionStyle,
} = usePointsShape();


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

  // 容器
  const parentRect = shapeRef.value!.parentElement!.getBoundingClientRect();

  // 按下并鼠标移动
  const mouseMove = (e: MouseEvent) => {
    const rect = shapeRef.value!.getBoundingClientRect();

    const offsetX = e.clientX - startX;
    const offsetY = e.clientY - startY;

    // 计算 left 定位
    let left = calcOffsetPosition(startLeft, -offsetX);
    // 判断是否超出右侧边界
    if(isPositionOutOfCanvasRight(left, rect.width, parentRect.width)) {
      left = Math.floor(parentRect.width - rect.width);
    };
    // 计算 top 定位
    const top = calcOffsetPosition(startTop, -offsetY);

    schemaStore.updatedComponentSchemaStyleById(editorStatusStore.selectedComponentSchemaId, {
      // 利用屏幕坐标偏移进行计算
      left,
      top,
    });
  
    // 设置组件正在移动并展示辅助线
    nextTick(() => {
      editorStatusStore.isMovingComponent = true;
      editorStatusStore.showLine(e.clientY - startY > 0, e.clientX - startX > 0);
    })
  }

  // 鼠标抬起
  const mouseUp = () => {  
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
    // 清楚辅助线
    editorStatusStore.isMovingComponent = false;
    editorStatusStore.hideLine();
  }

  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
}

// 处理旋转
const handleRotate = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if(!shapeRef.value) return
  const shapeRect = shapeRef.value.getBoundingClientRect();

  // 获取 shape 中心点坐标
  const center = {
    x: shapeRect.left + shapeRect.width / 2,
    y: shapeRect.top + shapeRect.height / 2,
  };

  const { style } = shapeRef.value;
  // 初始旋转角
  const beforeRotate = getRotateDeg(style.rotate);

  // 首次点击的角度值
  const startX = e.pageX - center.x;
  const startY = e.pageY - center.y;
  const beforeAngleFromOrigin = Math.atan2(startY, startX) * 180 / Math.PI;

  const move = (e: MouseEvent) => {
    // 计算移动的角度值
    const currentX = e.pageX - center.x
    const currentY = e.pageY - center.y
    const afterAngleFromOrigin = Math.atan2(currentY, currentX) * 180 / Math.PI

    // 更新 style
    schemaStore.updatedComponentSchemaStyleById(editorStatusStore.selectedComponentSchemaId, {
      rotate: beforeRotate + afterAngleFromOrigin - beforeAngleFromOrigin,
    });
  }

  const up = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    if(!shapeRef.value) return
    const { style } = shapeRef.value;
    const rotate = getRotateDeg(style.rotate);
    getNowCursor(rotate);
  }

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
}

// 处理鼠标移动
const handlePointMouseDown = (point: Points, e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if(!shapeRef.value) return;
  const getScaleStyle = handleScaleTransform(shapeRef as Ref<HTMLElement>, point, props.isProportion);

  const move = (e: MouseEvent) => {
    const style = getScaleStyle(e);
    schemaStore.updatedComponentSchemaStyleById(editorStatusStore.selectedComponentSchemaId, style)
  }

  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

</script>

<style scoped src="./index.scss"></style>