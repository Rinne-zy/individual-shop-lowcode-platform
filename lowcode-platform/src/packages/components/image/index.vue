<template>
  <div>
    <van-image
      :src="src"
      width="100%"
      height="100%"
      :round="isRound"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { Image as VanImage } from 'vant';
import type { ImagePropValue } from './type';

const props = defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<ImagePropValue>,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  }
})

// 默认图片
const defaultSrc = '/cover.png';

// 是否为圆角
const isRound = computed(() => props.propValue.isRound);
const src = computed(() => props.propValue.src || defaultSrc);
</script>

<style scoped>

</style>