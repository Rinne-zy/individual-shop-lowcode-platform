<template>
  <view class="horizon">
    <view class="radio">
      <u-checkbox-group>
        <u-checkbox
          :disabled="!canBuy"
          :checked="selected && status === CommodityStatus.OnSale"
          @change="handleSelect"
        />
      </u-checkbox-group>
    </view>
    <view style="position:relative;" @click="handleGoToCommodity">
      <img class="img" :src="cover" />
      <view v-if="!canBuy" class="tip"> {{ commodityStatus }}</view>
    </view>
    <view class="info">
      <view class="title">{{ name }}</view>
      <view class="buy">
        <view class="price">
          <view class="price-number">￥{{ price }}</view>
        </view>
      </view>
      <view class="number-box">
        <u-number-box 
          :disabledInput="true"
          :disablePlus="!canAdd"
          :disabled="!canBuy"
          :longPress="false"
          :model-value="props.number" 
          @change="handleChangeNum"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { CommodityStatus } from 'lowcode-platform-common/type/commodity';
import { ChangeNumType } from 'lowcode-platform-common/type/shopping-cart';

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
const handleChangeNum = (data: any) => {
  emits('change', props._id, data.value - props.number > 0 ? ChangeNumType.Add : ChangeNumType.Reduce);
};
const handleGoToCommodity = (e: MouseEvent) => {
  e.stopPropagation();
  if(!canBuy.value) return;
  emits('goToCommodity', props._id);
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
