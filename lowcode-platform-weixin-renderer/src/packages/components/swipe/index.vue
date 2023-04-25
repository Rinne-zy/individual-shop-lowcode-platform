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
        @click="handleClickImage(swipeItem.link)"
      >
        <img
          style="max-width: 100%;"
          :src="swipeItem.src"
          :style="swipeItemStyle"
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
import { useCommodityDetailStore } from 'lowcode-platform-weixin-renderer/store/commodity';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';
import { setRouterConfig, navigateTo } from 'lowcode-platform-weixin-renderer/utils/router';

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

const shopStore = useShopStore();
const commodityDetailStore = useCommodityDetailStore();

// 轮播图样式
const swipeItemStyle = computed(() => ({
  width: `${transformPxToVw(props.propStyle.width, props.viewportWidth)}`,
  height: `${props.propStyle.height}px`,
}));

// 轮播速度（单位秒）
const autoplaySpeed = computed(() => props.propValue.speed * 1000);

// 处理前往商城
const handleClickImage = (id: string | undefined) => {
  if(!id) return;

  // 设置商品详情展示所需的信息
  commodityDetailStore.commodityId = id;
  commodityDetailStore.shopId = shopStore._id;
  
  if(!id || !shopStore._id) return;
  setRouterConfig('shop', true);
  navigateTo('commodity')
}
</script>

<style scoped src="./index.scss"></style>
