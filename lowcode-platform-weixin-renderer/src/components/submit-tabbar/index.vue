<template>
  <view class="submit" :style="{ bottom: `${bottom}px` }">
    <view class="submit-text">
      <text>合计:</text>
      <text class="price">
        ￥<text class="integer" :class="{ not: !canSubmit }">{{ integer }}</text><text v-if="decimal" class="decimal" :class="{ not: !canSubmit }">.{{ decimal }}</text>
      </text>
    </view>
    <view class="submit-btn">
      <u-button
        type="error"
        :text="submitBarText"
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
  },
  submitBarText: {
    type: String,
    default: '提交订单'
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

  return `${props.price}`.split('.')[1] || '';
});
// 提交
const handleSubmit = () => {
  emits('submit')
}
</script>

<style lang="scss" scoped src="./index.scss"></style>