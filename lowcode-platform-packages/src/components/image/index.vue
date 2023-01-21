<template>
  <div>
    <van-image
      src="./azi.jpg"
      width="100%"
      height="100%"
      round
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Image as VanImage } from 'vant';

const props = defineProps({
  // 属性值
  propValue: {
    type: Object,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  }
})

const style = computed(() => props.propStyle)

</script>

<style scoped>

</style>