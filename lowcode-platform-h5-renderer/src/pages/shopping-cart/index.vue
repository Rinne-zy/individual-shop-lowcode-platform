<template>
  <div class="shopping-cart">
    <address-item :address-info="addressInfo"/>
    <shopping-cart-card
      v-for="(cartInfo, key) in data.commodities"
      :key="key"
      :title="key.split('-')[1]"
      :id="key.split('-')[0]"
      :commodities="cartInfo"
    />
   
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import ShoppingCartCard from 'lowcode-platform-h5-renderer/components/shopping-cart-card/index.vue';
import AddressItem from 'lowcode-platform-h5-renderer/components/address-item/index.vue';
import type { AddressInfo } from 'lowcode-platform-h5-renderer/type/address';
import { getSelectedAddressInfo } from 'lowcode-platform-h5-renderer/api/address';
import type { ShoppingCartInfo } from 'lowcode-platform-h5-renderer/type/commodity';

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

// 测试数据
const data = reactive<ShoppingCartInfo>({
  _id: '',
  username: '',
  commodities: {
    '640ec3edc059730d8e67e706-test2商城': [
      {
        _id: '64006cddcfdd8e7bfdb35765',
        name: 'test',
        cover: 'http://localhost:3300/images/test/5f64315e9afe841e2fbbe0700.png',
        price: 10000 * 0.51,
        number: 1,
        stock: 100,
        status: 1,
        selected: false,
      },
      {
        _id: '64017b9ca8b3a8639b52fda9',
        name: '测试商品',
        cover: 'http://localhost:3300/images/test/79e1131560c1cd6b70a86fa02.jpg',
        price: 10000 * 0.49,
        stock: 3,
        number: 3,
        status: 1,
        selected: false,
      },
    ],
    '63fc5f5c8cd10a4e3bd5a08e-test商城': [
      {
        _id: '6401ed2bb6c69fc690a8115f',
        name: '测试商品2',
        cover: 'http://localhost:3300/images/test/79e1131560c1cd6b70a86fa01.png',
        price: 10000,
        stock: 100,
        number: 2,
        status: 0,
        selected: false,
      },
    ]
  },
})
</script>

<style lang="scss" scoped src="./index.scss"></style>