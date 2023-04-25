<template>
  <view 
    class="schema-renderer" 
  >
    <view
      v-for="component in components"
      :key="component.id"
      :style="getComponentStyleToViewPort(component.style)"
      :class="[ isFixedMode ? 'fixedLayout' : 'sequentialLayout', 'component-wrap']"
    >
      <my-image
        v-if="component.key === 'Image'"
        class="component"
        :prop-value="(component.propValue as any)"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
      <my-text
        v-if="component.key === 'Text'"
        class="component"
        :prop-value="(component.propValue as any)"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
      <my-swiper
        v-if="component.key === 'Swipe'"
        class="component"
        :prop-value="(component.propValue as any)"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
      <my-shop
        v-if="component.key === 'Shop'"
        class="component"
        :prop-value="(component.propValue as any)"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
      <my-commodity
        v-if="component.key === 'Commodity'"
        class="component"
        :prop-value="(component.propValue as any)"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
      <my-commodity-grouping
        v-if="component.key === 'Grouping'"
        class="component"
        :prop-value="(component.propValue as any)"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
      <my-rich-text 
        v-if="component.key === 'richText'"
        class="component"
        :prop-value="(component.propValue as any)"
        :prop-style="component.style"
        :viewport-width="shopStore.getWidthPxNumber()"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import MyImage from 'lowcode-platform-weixin-renderer/packages/components/image/index.vue';
import MyText from 'lowcode-platform-weixin-renderer/packages/components/text/index.vue';
import MySwiper from 'lowcode-platform-weixin-renderer/packages/components/swipe/index.vue';
import MyShop from 'lowcode-platform-weixin-renderer/packages/components/shop/index.vue';
import MyCommodity from 'lowcode-platform-weixin-renderer/packages/components/commodity/index.vue';
import MyCommodityGrouping from 'lowcode-platform-weixin-renderer/packages/components/grouping/index.vue';
import MyRichText from 'lowcode-platform-weixin-renderer/packages/components/richtext/index.vue';

import { getComponentStyleToViewPort } from 'lowcode-platform-common/utils/style';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';

// schema 存储 store
const shopStore = useShopStore();
// 组件 schema
const components = computed(() => shopStore.schema.components);
// 是否为固定定位
const isFixedMode = computed(() => shopStore.isFixLayoutMode());
</script>

<style lang="scss" scoped src="./index.scss"></style>