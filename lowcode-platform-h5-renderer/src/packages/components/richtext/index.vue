<template>
  <div class="rich-text" :style="{ fontSize: `${propValue.fontSize}px`}">
    <div v-html="propValue.content" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { RichTextPropValue } from './type';

defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<RichTextPropValue>,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  }
});

</script>

<style lang="scss" scoped src="./index.scss"></style>