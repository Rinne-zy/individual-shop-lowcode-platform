<template>
  <div>
    <img
      class="image"
      :src="propValue.src"
      :class="{ 'image-round': propValue.isRound}"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { ImagePropValue } from './type';

defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<ImagePropValue>,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  },
  viewportWidth: {
    type: Number,
    default: 375,
  }
})
</script>

<style scoped></style>