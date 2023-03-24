<template>
  <div
    v-show="isVisible"
    class="realtime-preview"
    @click="isVisible = false"
  >
    <div v-if="isVisible" class="realtime-preview-content" :style="canvasStyle" @click="e => e.stopPropagation()">
      <div
        v-for="component in schemaStore.schema.components"
        :key="component.id"
        :style="style(component.style)"
        :class="[ schemaStore.isFixLayoutMode() ? 'fixedLayout' : 'sequentialLayout']"
      >
        <component
          class="component"
          :is="component.key"
          :prop-value="component.propValue"
          :prop-style="component.style"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useSchemaStore } from 'lowcode-platform/store/schema-store';

defineExpose({
  show() {
    isVisible.value = true;
  }
})

const schemaStore = useSchemaStore();
// 是否可见
const isVisible = ref(false);
// 实时预览的画布大小
const canvasStyle = computed(() => {
  const { editor } = schemaStore.schema;
  return {
    width: editor.width,
    height: editor.height,
  }
})
// 组件样式
const style = (componentStyle: Record<string, string | number>) => {
  const commonStyle: Record<string, string> = {};
  Object.keys((componentStyle)).forEach((key) => {
    commonStyle[key] = `${componentStyle[key]}px`;
  })

  return {
    ...commonStyle,
    rotate: `${componentStyle.rotate}deg`,
  }
}

</script>

<style lang="scss" scoped src="./index.scss"></style>