<template>
  <div>
    <swipe :autoplay="autoplaySpeed" :lazy-render="isLazyLoad">
      <swipe-item 
        v-for="(swipeItem, index) in swipeData"
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
  }
})

// 轮播图样式
const swipeItemStyle = computed(() => ({
  width: `${props.propStyle.width}`,
  height: `${props.propStyle.height}`,
}));

// 是否懒加载
const isLazyLoad = computed(() => props.propValue.lazyLoad);
// 轮播速度（单位秒）
const autoplaySpeed = computed(() => props.propValue.speed * 1000);

const swipeData = computed(() => {
  if(!props.propValue.swipeItems.length) {
    return [{
      src: '/cover.png'
    }];
  };
  
  return props.propValue.swipeItems;
});
</script>

<style scoped src="./index.scss"></style>
