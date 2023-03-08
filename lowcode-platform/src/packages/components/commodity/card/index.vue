<template>
  <div :class="cardClass">
    <img class="img" :src="cover" />
    <div class="info">
      <div class="title">{{ title }}</div>
      <div v-if="isShowDesc" class="desc many-line-ellipsis">{{ desc }}</div>
      <!-- 行内模式不需要占位符 -->
      <div v-else-if="!isShowDesc && type !== 'inline'" class="desc-placeholder"/>
      <div class="buy">
        <div class="price">
          <div class="price-number">
            <span class="price-number-currency">￥</span>
            <span class="price-number-integer">{{ priceText.integer }}</span>
            <span class="price-number-dot">.</span>
            <span class="price-number-decimal">{{ priceText.decimal }}</span>
          </div>
          <div v-if="isShowOriginPrice" class="price-number origin-price">
            {{ originPrice.toFixed(2) }}
          </div>
        </div>
        <div class="cart">
          <van-icon size="20" name="cart-o" color="#ff4444" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon as VanIcon } from "vant";
import { computed, PropType } from "vue";

const props = defineProps({
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

// 展示的价格文本
const priceText = computed(() => {
  const priceNumber: string[] = `${props.price}`.split(".");
  return {
    integer: priceNumber[0],
    decimal: priceNumber[1] || `00`,
  };
});

// 卡片的样式类
const cardClass = computed(() => {
  if (props.type === 'inline') return 'vertical inline';
  return props.type;
});

// 是否展示原价
const isShowOriginPrice = computed(
  () => props.isShowOriginPrice && 
    props.type !== 'inline' && 
    props.price !== props.originPrice
);

// 是否展示详情
const isShowDesc = computed(() => props.isShowDesc);
</script>

<style lang="scss" scoped src="./index.scss"></style>
