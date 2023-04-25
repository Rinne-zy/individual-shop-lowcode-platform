<template>
  <view class="rich-text" :style="{ fontSize: `${transformPxToVw(propValue.fontSize, viewportWidth)}`}">
    <view v-html="propValue.content" />
  </view>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import { transformPxToVw } from 'lowcode-platform-common/utils/style';
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
  },
  viewportWidth: {
    type: Number,
    default: 375,
  }
});

</script>

<style lang="scss" scoped src="./index.scss"></style>