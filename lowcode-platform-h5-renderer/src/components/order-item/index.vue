<template>
    <div class="order-commodity-item">
      <div class="shop-title">{{ name }}</div>
      <div v-if="addressInfo" class="order-address">快递地址：{{ addressInfo }}</div>
      <div class="commodities-preview">
        <div class="commodities-preview-cover">  
          <div
            class="commodities-preview-cover-image"
            v-for="(commodity, index) in needToShowCommodities"
            :key="index"
          >
            <img
              width="50"
              height="50"
              :src="commodity.cover"
            >
            <span>x{{ commodity.number }}</span>
          </div>   
          <div v-if="ellipsis && needToShowCommodities.length > previewNum" class="more">......</div>
        </div>
        <div v-if="totalNum" class="commodities-preview-num">共{{ totalNum }}件</div>
      </div>
      <div v-if="isPaying" class="paying">
        <div class="paying-price">￥{{ totalPrice }}</div>
        <div class="paying-operation">
          <van-button class="paying-operation-button" type="danger" size="small" round plain @click="handlePay">立即支付</van-button>
          <van-button class="paying-operation-button" type="default" size="small" round plain @click="handleCancel">取消订单</van-button>
        </div>
      </div>
      <div v-if="canFinish" class="finish">
        <div class="finish-operation">
          <van-button class="paying-operation-button" type="success" size="small" round plain @click="handleFinish">确认收货</van-button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

import { Button as VanButton } from 'vant';

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