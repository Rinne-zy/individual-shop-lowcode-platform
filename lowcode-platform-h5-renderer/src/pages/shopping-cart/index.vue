<template>
  <div class="shopping-cart">
    <address-item
      :address-info="addressInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import AddressItem from 'lowcode-platform-h5-renderer/components/address-item/index.vue';
import type { AddressInfo } from 'lowcode-platform-h5-renderer/type/address';
import { getSelectedAddressInfo } from 'lowcode-platform-h5-renderer/api/address';

// 地址信息
const addressInfo = reactive<AddressInfo>({
  id: '',
  tel: '',
  name: '',
  city: '',
  county: '',
  country: '',
  province: '',
  areaCode: '',
  isDefault: false,
  addressDetail: '',
});

// 获取选中的地址
const getUserSelectedAddress = async () => {
 const info = await getSelectedAddressInfo();
 if(!info) return;
 Object.assign(addressInfo, info);
};
getUserSelectedAddress();
</script>

<style lang="scss" scoped src="./index.scss"></style>