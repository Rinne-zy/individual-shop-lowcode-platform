<template>
  <div class="schema-renderer">
    <div
      v-for="component in components"
      :key="component.id"
      :style="getComponentStyleToViewPort(component.style)"
      :class="[ isFixedMode ? 'fixedLayout' : 'sequentialLayout']"
    >
      <component
        class="component"
        :is="schemaStore.components.get(component.key)"
        :prop-value="component.propValue"
        :prop-style="component.style"
        :viewport-width="schemaStore.getWidthPxNumber()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getComponentStyleToViewPort } from 'lowcode-platform-h5-renderer/utils/style';
import { useSchemaStore } from 'lowcode-platform-h5-renderer/store/schema';

// schema 存储 store
const schemaStore = useSchemaStore();
// 组件 schema
const components = computed(() => schemaStore.schema.components);
// 是否为固定定位
const isFixedMode = computed(() => schemaStore.isFixLayoutMode());
</script>

<style lang="scss" scoped src="./index.scss"></style>