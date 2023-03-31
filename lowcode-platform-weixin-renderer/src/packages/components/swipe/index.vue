<template>
  <view>
    <swiper
      autoplay
      indicator-dots
      :interval="autoplaySpeed"
      :style="swipeItemStyle"
    >
      <swiper-item 
        v-for="(swipeItem, index) in propValue.swipeItems"
        :key="index"
      >
        <van-image
          style="max-width: 100%;"
          :src="swipeItem.src"
          :width="swipeItemStyle.width"
          :height="swipeItemStyle.height"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

import type { SwipePropValue } from './type';
import { transformPxToVw } from 'lowcode-platform-common/utils/style';

const props = defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<SwipePropValue>,
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

// 轮播图样式
const swipeItemStyle = computed(() => ({
  width: `${transformPxToVw(props.propStyle.width, props.viewportWidth)}`,
  height: `${transformPxToVw(props.propStyle.height, props.viewportWidth)}`,
}));

// 是否懒加载
const isLazyLoad = computed(() => props.propValue.lazyLoad);
// 轮播速度（单位秒）
const autoplaySpeed = computed(() => props.propValue.speed * 1000);

</script>

<style scoped src="./index.scss"></style>
