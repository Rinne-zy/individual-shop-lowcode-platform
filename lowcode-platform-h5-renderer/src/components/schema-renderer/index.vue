<template>
  <div 
    class="schema-renderer" 
  >
    <div
      v-for="component in components"
      :key="component.id"
      :style="getComponentStyleToViewPort(component.style)"
      :class="[ isFixedMode ? 'fixedLayout' : 'sequentialLayout']"
    >
      <component
        class="component"
        :is="shopStore.components.get(component.key)"
        :prop-value="component.propValue"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getComponentStyleToViewPort } from 'lowcode-platform-h5-renderer/utils/style';
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';

// schema 存储 store
const shopStore = useShopStore();
// 组件 schema
const components = computed(() => shopStore.schema.components);
// 是否为固定定位
const isFixedMode = computed(() => shopStore.isFixLayoutMode());
</script>

<style lang="scss" scoped src="./index.scss"></style>