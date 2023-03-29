<template>
  <div class="shop" :style="shopInfoStyle">
    <div class="shop-info">
      <img :src="iconSrc" width="60" height="60">
      <div class="shop-info-text" :style="textColor">
        <div class="title">{{ shopTitle }}</div>
        <div class="desc">{{ propValue.desc }}</div>
      </div>
      <div class="star-shop" v-if="!isLove" @click="handleClickStarShop"><van-icon name="like-o" />收藏店铺</div>
      <div class="star-shop isStar" v-else @click="handleClickStarShop"><van-icon name="like" color="red"/>已收藏</div>
      <div class="share-shop" @click="copyShopAddress"><van-icon name="share-o" :size="20"/></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { showSuccessToast, Icon as VanIcon } from 'vant';

import { ShopInfoPropValue } from './type';
import { copy } from 'lowcode-platform-common/utils/copy';

const props = defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<ShopInfoPropValue>,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  }
});

// 商店信息样式
const shopInfoStyle = computed(() =>({
  backgroundImage: `url(${props.propValue.background || './default.webp'})`
}));
// 商品标题
const shopTitle = computed(() => props.propValue.useDefault ? '默认标题': props.propValue.title);
// 文本颜色
const textColor = computed(() => ({
  color: props.propValue.color
}));
// 商店图标
const iconSrc = computed(() => props.propValue.useDefault ? '/cover.png' : props.propValue.icon);

const isLove = ref(false);
const handleClickStarShop = () => {
  isLove.value = !isLove.value
};

// 复制
const copyShopAddress = async () => {
  await copy('测试');
  showSuccessToast('复制成功');
};
</script>

<style lang="scss" scoped src="./index.scss"></style>