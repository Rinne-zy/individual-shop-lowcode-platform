<template>
  <div class="grouping">
    <TabBar 
      :tab-list="tabBarList"
      v-model="active"
    />
    <div class="grouping-commodities">
      <Commodity :prop-value="commodityPropValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';

import TabBar from './tabBar/index.vue';
import Commodity from '../commodity/index.vue';
import type { GroupingPropValue } from './type';
import { useCommodityStore } from 'lowcode-platform/store/commodity-store';
import type { CommodityPropValue } from '../commodity/type';

const props = defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<GroupingPropValue>,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  },
  isPreview: {
    type: Boolean,
    default: false,
  }
});

const commodityStore = useCommodityStore();

// tabBar 列表
const tabBarList = computed(() => {
  const { grouping } = props.propValue;

  return grouping.map((info) => {
    const { value, name } = info
    return {
      value,
      name,
    }
  })
});

// 激活的 tabBar 项
const active = props.isPreview ? ref(tabBarList.value[0].value) : computed(() => tabBarList.value[0].value);

// 商品列表数据
const commodityPropValue = computed(() => {
  const { padding, layout, grouping, isShowDesc, isShowOriginPrice, isRound } = props.propValue

  const activeCommodities = grouping.find((group) => group.value === active.value);

  return {
    padding,
    layout,
    isShowDesc,
    isShowOriginPrice,
    isRound,
    commodities: activeCommodities?.commodities || [],
    sort: activeCommodities?.order
  } as CommodityPropValue
});
</script>

<style lang="scss" scoped src="./index.scss"></style>