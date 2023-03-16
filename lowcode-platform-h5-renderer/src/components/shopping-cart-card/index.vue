<template>
  <div class="shopping-cart-card">
    <div class="title">
      <van-checkbox 
        :model-value="isSelectedAll"
        class="title-radio"
        :icon-size="18"
        @click="handleSelectAll"
      />
      <span class="title-text">{{ title }}</span>
      <van-icon class="title-icon" name="arrow" />    
    </div>
    <commodity-card
      v-for="commodity in commodities"
      :key="commodity._id"
      v-bind="commodity"
      @select="handleSelect"
      @change=""
    >
    </commodity-card>
  </div>
</template>

<script setup lang="ts">
import { Checkbox as VanCheckbox, Icon as VanIcon } from 'vant';
import { computed, PropType } from 'vue';


import CommodityCard from '../commodity-card/index.vue';
import type { Commodity } from 'lowcode-platform-h5-renderer/type/commodity';
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: ''
  },
  commodities: {
    type: Array as PropType<Commodity[]>,
    default: () => {},
  }
});

// 是否选中购物车中该商城全部商品
const isSelectedAll = computed(() => props.commodities.every((commodity) => commodity.selected))

// 选择购物车该商城的所有商品
let isHandlingSelectAll = false;
const handleSelectAll = async () => {
  let isHandlingSelectAll = false;
 // TODO: 修改为网络请求
};

// 单选商品
let isHandlingSelect = false;
const handleSelect = async (selectStatus: boolean) => {
  if(isHandlingSelect) return;
  // TODO: 修改为网络请求
};

// 改变商品数目
let isHandlingChangeNum = false;
const handleChangeNum= async (number: number) => {
  if(isHandlingChangeNum) return;
  // TODO: 修改为网络请求
};
</script>

<style lang="scss" scoped src="./index.scss"></style>