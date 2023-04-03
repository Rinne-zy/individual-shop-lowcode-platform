<template>
  <view class="submit" :style="{ bottom: `${bottom}px` }">
    <view class="submit-text">
      <text>合计:</text>
      <text class="price">
        ￥<text class="integer " :class="{ not: !canSubmit }">{{ integer }}</text>.{{ decimal }}
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

const integer = computed(() => {
  if(props.price === 0) {
    return '0'
  };
  
  return `${props.price * Math.pow(10, 2)}`.slice(0, -props.decimal);
});
const decimal = computed(() => {
  if(props.price === 0) {
    return '00'
  };

  return `${props.price * Math.pow(10, 2)}`.slice(-props.decimal)
});

const handleSubmit = () => {
  emits('submit')
}
</script>

<style lang="scss" scoped src="./index.scss"></style>