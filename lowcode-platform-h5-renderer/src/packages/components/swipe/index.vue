<template>
  <div>
    <swipe :autoplay="autoplaySpeed" :lazy-render="isLazyLoad">
      <swipe-item 
        v-for="(swipeItem, index) in propValue.swipeItems"
        :key="index"
        :height="swipeItemStyle.height"
        @click="handleClickImage(swipeItem.link)"
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
import { useRouter } from 'vue-router';

import type { SwipePropValue } from './type';
import { transformPxToVw } from 'lowcode-platform-common/utils/style';
import { useCommodityDetailStore } from 'lowcode-platform-h5-renderer/store/commodity';
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';

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
const router = useRouter();
const commodityDetailStore = useCommodityDetailStore();

// 轮播图样式
const swipeItemStyle = computed(() => ({
  width: `${transformPxToVw(props.propStyle.width, props.viewportWidth)}`,
  height: `${transformPxToVw(props.propStyle.height, props.viewportWidth)}`,
}));

// 是否懒加载
const isLazyLoad = computed(() => props.propValue.lazyLoad);
// 轮播速度（单位秒）
const autoplaySpeed = computed(() => props.propValue.speed * 1000);
// 处理前往商城
const handleClickImage = (id: string | undefined) => {
  if(!id) return;

    // 设置商品详情展示所需的信息
  commodityDetailStore.commodityId = id;
  commodityDetailStore.shopId = shopStore._id;

  if(!id || !shopStore._id) return;
  router.push('/commodity');
}

</script>

<style scoped src="./index.scss"></style>
