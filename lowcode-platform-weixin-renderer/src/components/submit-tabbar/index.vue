<template>
  <view class="submit" :style="{ bottom: `${bottom}px` }">
    <view class="submit-text">
      <text>合计:</text>
      <text class="price">
        ￥<text class="integer " :class="{ not: !canSubmit }">{{ integer }}</text><text style="color: #ee0a24;">.{{ decimal }}</text>
      </text>
    </view>
    <view class="submit-btn">
      <u-button
        type="error"
        text="提交订单"
        shape='circle'
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        :disabled="!canSubmit"
        @click="handleSubmit"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  price: {
    type: Number,
    default: 0,
  },
  decimal: {
    type: Number,
    default: 2,
  },
  bottom: {
    type: Number,
    default: 0,
  },
  canSubmit: {
    type: Boolean,
    default: false,
  }
});

const emits = defineEmits(['submit'])
// 整数
const integer = computed(() => {
  if(props.price === 0) {
    return '0'
  };
  
  return `${props.price}`.split('.')[0];
});
// 小数
const decimal = computed(() => {
  if(props.price === 0) {
    return '00'
  };

  return `${props.price}`.split('.')[1];
});

const handleSubmit = () => {
  emits('submit')
}
</script>

<style lang="scss" scoped src="./index.scss"></style>