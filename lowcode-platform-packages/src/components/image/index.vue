<template>
  <div>
    <van-image
      src="./azi.jpg"
      :width="width"
      :height="height"
      round
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Image as VanImage } from 'vant';

const props = defineProps({
  // 属性值
  propValue: {
    type: Object,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: CSSStyleDeclaration,
    default: () => {},
  }
})

// 图片宽高
const width = ref(props.propStyle.width);
const height = ref(props.propStyle.height)

</script>

<style scoped>

</style>