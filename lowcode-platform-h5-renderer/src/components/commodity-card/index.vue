<template>
  <div class="horizon">
    <van-checkbox
      class="radio"
      checked-color="#ff0000"
      icon-size="16"
      :disabled="!canBuy" 
      :model-value="selected"
      @click="handleSelect"
    />
    <div style="position:relative;">
      <img class="img" :src="cover" />
      <div v-if="!canBuy" class="tip"> {{ commodityStatus }}</div>
    </div>
    <div class="info">
      <div class="title">{{ name }}</div>
      <div class="buy">
        <div class="price">
          <div class="price-number">￥{{ price }}</div>
        </div>
        <stepper
          disable-input
          :model-value="props.number"
          :disabled="!canBuy"
          :disable-plus="!canAdd"
          @plus="handleChangeNum(props.number + 1)"
          @minus="handleChangeNum(props.number - 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Checkbox as VanCheckbox, Stepper } from 'vant';
import { computed } from 'vue';

import { CommodityStatus } from 'lowcode-platform-h5-renderer/type/commodity';

const emits = defineEmits(['select', 'change'])

const props = defineProps({
  cover: {
    type: String,
    default: "/cover.png",
  },
  name: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  number: {
    type: Number,
    default: 0,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Number,
    default: CommodityStatus.OnStore,
  },
  stock: {
    type: Number,
    default: 0,
  }
});

// 当前商品是否可以购买
const canBuy = computed(() => props.status === CommodityStatus.OnSale);
// 是否能够添加
const canAdd = computed(() => props.stock > props.number);

// 筛选状态
const commodityStatus = props.status === CommodityStatus.OnStore ? '未上架' : '已售罄';

// 处理选择商品
const handleSelect = () => {
  emits('select', !props.selected);
}

// 改变商品数量
const handleChangeNum = (value: number) => {
  emits('change', value);
}
</script>

<style lang="scss" scoped src="./index.scss"></style>
