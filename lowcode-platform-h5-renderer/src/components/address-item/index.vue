<template>
  <div class="address">
    <div class="address-item">
      <div class="address-item-top">
        <van-tag class="tag" v-if="addressInfo.isDefault" round type="danger">默认</van-tag>
        <div class="address-area">{{ areaInfo }}</div>
      </div>
      <div class="address-item-center">{{ addressInfo.addressDetail }}</div>
      <div class="address-item-bottom">
        <span>{{ addressInfo.name }}</span>
        <span class="phone">{{ addressInfo.tel }}</span>
      </div>
      </div>
    <div class="divider">
      <div v-for="num in 12" :class="['divider-item', num % 2 === 0 ? 'origen' : 'blue']"></div>
    </div>
    <van-icon v-if="canSelect" class="arrow-icon" name="arrow" @click="goToAddressSelectPage"/>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Tag as VanTag, Icon as VanIcon } from 'vant';
import { computed, PropType } from 'vue';

import type { AddressInfo } from 'lowcode-platform-h5-renderer/type/address';

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
// 路由
const router = useRouter();

// 前往选择地址详情页
const goToAddressSelectPage = () => {
  router.push('/address');
}

</script>

<style lang="scss" scoped src="./index.scss"></style>