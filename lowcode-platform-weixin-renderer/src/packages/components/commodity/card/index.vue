<template>
  <view :class="cardClass">
    <view class="img-warp">
      <img class="img" :src="cover" />
    </view>
    <view class="info">
      <view class="title">{{ title }}</view>
      <view v-if="isShowDesc" class="desc many-line-ellipsis">{{ desc }}</view>
      <!-- 行内模式不需要占位符 -->
      <view v-else-if="!isShowDesc && type !== 'inline'" class="desc-placeholder"/>
      <view class="buy">
        <view class="price">
          <view class="price-number">
            <text class="price-number-currency">￥</text>
            <text class="price-number-integer">{{ priceText.integer }}</text>
            <text class="price-number-dot">.</text>
            <text class="price-number-decimal">{{ priceText.decimal }}</text>
          </view>
          <view v-if="isShowOriginPrice" class="price-number origin-price">
            {{ originPrice.toFixed(2) }}
          </view>
        </view>
        <view class="cart" @click="handleAddToCart">
          <van-icon size="20" name="cart-o" color="#ff4444" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  type: {
    type: String as PropType<'vertical' | 'horizon' | 'inline'>,
    default: 'horizon',
  },
  cover: {
    type: String,
    default: "/cover.png",
  },
  title: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  originPrice: {
    type: Number,
    default: 0,
  },
  isShowDesc: {
    type: Boolean,
    default: true,
  },
  isShowOriginPrice: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['add'])

// 是否展示原价
const isShowOriginPrice = props.isShowOriginPrice && props.type !== 'inline' && props.price !== props.originPrice
// 卡片的样式类
const cardClass = props.type === 'inline' ? 'vertical inline' : props.type;
// 展示的价格文本
const priceText = computed(() => {
  const priceNumber: string[] = `${props.price}`.split(".");
  return {
    integer: priceNumber[0],
    decimal: priceNumber[1] || `00`,
  };
});

// 添加商品至购物车
const handleAddToCart = (e: MouseEvent) => {
  e.stopPropagation();
  emits('add', props.id);
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
