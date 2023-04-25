<template>
  <div 
    class="schema-renderer" 
  >
    <div
      v-for="component in components"
      :key="component.id"
      :style="getComponentStyleToViewPort(component.style, shopStore.getWidthPxNumber(), isFixedMode)"
      :class="getComponentLayoutClass(component.inline)"
    >
      <component
        class="component"
        :is="shopStore.getComponentByKey(component.key)"
        :is-inline="component.inline"
        :prop-value="component.propValue"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getComponentStyleToViewPort } from 'lowcode-platform-common/utils/style';
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';

// schema 存储 store
const shopStore = useShopStore();
// 组件 schema
const components = computed(() => shopStore.schema.components);
// 是否为固定定位
const isFixedMode = computed(() => shopStore.isFixLayoutMode());

const getComponentLayoutClass = (isInline: boolean) => {
  if(isFixedMode.value) return 'fixedLayout';
  return isInline ? 'sequentialLayout-inline' : 'sequentialLayout'
}

</script>

<style lang="scss" scoped src="./index.scss"></style>