<template>
  <div>
    <swipe :autoplay="autoplaySpeed" :lazy-render="isLazyLoad">
      <swipe-item 
        v-for="(swipeItem, index) in propValue.swipeItems"
        :key="index"
        :height="swipeItemStyle.height"
      >
        <van-image
          style="max-width: 100%;"
          :src="swipeItem.src"
          :width="swipeItemStyle.width"
          :height="swipeItemStyle.height"
        />
      </swipe-item>
    </swipe>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Swipe, SwipeItem, Image as VanImage} from 'vant';

import type { SwipePropValue } from './type';
import { transformPxToVw } from 'lowcode-platform-h5-renderer/utils/transform';

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
