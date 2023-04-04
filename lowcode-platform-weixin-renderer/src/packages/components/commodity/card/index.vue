<template>
  <view :class="cardClass" @click="handleGoToCommodity(props.id)">
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
        <view class="cart" @click.stop="handleAddToCart">
          <van-icon size="20" name="cart-o" color="#ff4444" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from "lowcode-platform-weixin-renderer/store/user";
import { navigateTo, setRouterConfig } from "lowcode-platform-weixin-renderer/utils/router";
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

const emits = defineEmits(['add', 'click']);
const userStore = useUserStore();
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

// 判断是否登录
const checkIsLogin = async () => {
  const isLogin = await userStore.checkLogin();
  if(!isLogin) {
    setRouterConfig('shop', true);
    navigateTo('login');
    return false;
  };
  return isLogin;
};

// 添加商品至购物车
const handleAddToCart = async () => {
  if(!await checkIsLogin()) return;
  emits('add', props.id);
};

// 处理点击事件
const handleGoToCommodity = (id: string) => {
  emits('click', id);
} 

</script>

<style lang="scss" scoped src="./index.scss"></style>
