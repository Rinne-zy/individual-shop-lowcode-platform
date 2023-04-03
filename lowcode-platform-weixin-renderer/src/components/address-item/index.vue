<template>
  <view class="address">
    <view class="address-item">
      <view class="address-item-top">
        <view class="tag" v-if="addressInfo.isDefault"><u-tag text="默认" round plain size="mini" type="error" /></view>
        <view class="address-area">{{ areaInfo }}</view>
      </view>
      <view class="address-item-center">{{ addressInfo.addressDetail }}</view>
      <view class="address-item-bottom">
        <span>{{ addressInfo.name }}</span>
        <span class="phone">{{ addressInfo.tel }}</span>
      </view>
      </view>
    <view class="divider">
      <view v-for="num in 12" :class="['divider-item', num % 2 === 0 ? 'origen' : 'blue']"></view>
    </view>
    <van-icon v-if="canSelect" class="arrow-icon" name="arrow" @click="goToAddressSelectPage"/>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

import type { AddressInfo } from 'lowcode-platform-common/type/address';

const props = defineProps({
  addressInfo: {
    type: Object as PropType<AddressInfo>,
    default: () => {}
  },
  canSelect: {
    type: Boolean,
    default: true,
  }
});

// 地区信息
const areaInfo = computed(() => {
  const { city, province, country } = props.addressInfo
  if(!city && !province && !country) return ''
  return `${props.addressInfo.city === props.addressInfo.province ? props.addressInfo.province : props.addressInfo.city}${props.addressInfo.county}`
})

// 前往选择地址详情页
const goToAddressSelectPage = () => {
}

</script>

<style lang="scss" scoped src="./index.scss"></style>