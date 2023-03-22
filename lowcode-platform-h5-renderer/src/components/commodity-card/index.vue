<template>
  <div class="horizon">
    <van-checkbox
      class="radio"
      checked-color="#ff0000"
      icon-size="16"
      :disabled="!canBuy" 
      :model-value="selected && status === CommodityStatus.OnSale"
      @click="handleSelect"
    />
    <div style="position:relative;" @click="handleGoToCommodity">
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
          button-size="24"
          :model-value="props.number"
          :disabled="!canBuy"
          :disable-plus="!canAdd"
          @plus="handleChangeNum(1)"
          @minus="handleChangeNum(-1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Checkbox as VanCheckbox, Stepper } from 'vant';
import { computed } from 'vue';

import { CommodityStatus } from 'lowcode-platform-h5-renderer/type/commodity';
import { ChangeNumType } from 'lowcode-platform-h5-renderer/api/shopping-cart';

const emits = defineEmits(['select', 'change', 'goToCommodity'])

const props = defineProps({
  _id: {
    type: String,
    default: '',
  },
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

// 筛选状态
const commodityStatus = props.status === CommodityStatus.OnStore ? '未上架' : '已售罄';
// 当前商品是否可以购买
const canBuy = computed(() => props.status === CommodityStatus.OnSale);
// 是否能够添加
const canAdd = computed(() => props.stock > props.number);

// 处理选择商品
const handleSelect = () => {
  if(!canBuy.value) return;
  emits('select', props._id);
};
// 改变商品数量
const handleChangeNum = (value: number) => {
  emits('change', props._id, value > 0 ? ChangeNumType.Add : ChangeNumType.Reduce);
};
const handleGoToCommodity = (e: MouseEvent) => {
  e.stopPropagation();
  if(!canBuy.value) return;
  emits('goToCommodity', props._id);
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
