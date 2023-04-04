<template>
    <view class="order-commodity-item">
      <text class="shop-title">{{ name }}</text>
      <text v-if="addressInfo" class="order-address">快递地址：{{ addressInfo }}</text>
      <view class="commodities-preview">
        <view class="commodities-preview-cover">  
          <view
            class="commodities-preview-cover-image"
            v-for="(commodity, index) in needToShowCommodities"
            :key="index"
          >
            <img
              class="cover"
              :src="commodity.cover"
            >
            <text>x{{ commodity.number }}</text>
          </view>   
          <text v-if="ellipsis && needToShowCommodities.length > previewNum" class="more">......</text>
        </view>
        <text v-if="totalNum" class="commodities-preview-num">共{{ totalNum }}件</text>
      </view>
      <view v-if="isPaying" class="paying">
        <text class="paying-price">￥{{ totalPrice }}</text>
        <view class="paying-operation">
          <view class="paying-operation-button"><u-button type="error" text="立即支付" size="mini" shape="circle" plain @click="handlePay" /></view>
          <view class="paying-operation-button"><u-button type="info " text="取消订单" size="mini" shape="circle" plain @click="handleCancel" /></view>
        </view>
      </view>
      <view v-if="canFinish" class="finish">
        <view class="finish-operation">
          <view class="paying-operation-button"><u-button type="success" text="确认收货" size="mini" shape="circle" plain @click="handleFinish" /></view>
        </view>
      </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';


const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  ellipsis: {
    type: Boolean,
    default: true,
  },
  isPaying: {
    type: Boolean,
    default: false,
  },
  canFinish: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: false,
  },
  totalNum: {
    type: Number,
    default: 0,
  },
  previewNum: {
    type: Number,
    default: 4,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  commoditiesInfo: {
    type: Array as PropType<{ cover: string, number: number }[]>,
    default: () => [],
  },
  addressInfo: {
    type: String,
    default: '',
  }
});

const emits = defineEmits(['pay', 'cancel', 'finish'])

// 需要展示的商品
const needToShowCommodities = computed(() => {
  if(props.ellipsis) {
    return props.commoditiesInfo.slice(0, props.previewNum);
  };

  return props.commoditiesInfo;
})

// 处理支付
const handlePay = () => {
  emits('pay', props.id, props.totalPrice);
};
// 处理取消
const handleCancel = () => {
  emits('cancel', props.id);
};
const handleFinish = () => {
  emits('finish', props.id);
}
</script>

<style lang="scss" scoped src="./index.scss"></style>