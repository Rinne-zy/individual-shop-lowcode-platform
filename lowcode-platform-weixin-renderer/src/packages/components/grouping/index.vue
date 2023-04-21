<template>
  <view class="grouping">
    <TabBar 
      :tab-list="tabBarList"
      v-model="active"
    />
    <view class="grouping-commodities">
      <Commodity :prop-value="commodityPropValue" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import type { PropType } from 'vue';

import TabBar from './tabBar/index.vue';
import Commodity from '../commodity/index.vue';
import { CommoditiesOrder } from './type';
import type {  GroupingPropValue } from './type';
import type { CommodityPropValue } from '../commodity/type';
import { getCommoditiesByType } from 'lowcode-platform-weixin-renderer/api/commodity';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';

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
  }
});

const shopStore = useShopStore();

// 最新的商品 id
const newCommoditiesIds = ref<string[]>([]);
// 最热的商品id
const hotCommoditiesIds = ref<string[]>([]);
// 当前激活的 tab 下的商品信息
const activeCommoditiesInfo = ref({
  order: CommoditiesOrder.Default,
  ids: [] as string[]
})

// tabBar 列表
const tabBarList = props.propValue.grouping.map((info) => {
  const { value, name } = info
  return {
    value,
    name,
  }
})

// 激活的 tabBar 项
const active = ref(tabBarList[0]?.value || '');

// 商品列表数据
const commodityPropValue = computed(() => {
  const { padding, layout, isShowDesc, isShowOriginPrice, isRound } = props.propValue

  return {
    padding,
    layout,
    isShowDesc,
    isShowOriginPrice,
    isRound,
    commodities: activeCommoditiesInfo.value.ids,
    order: activeCommoditiesInfo.value.order
  } as CommodityPropValue
});

// 获取最新的商品 id
const getNewCommoditiesIds = async (type: string | undefined, number: number) => {
  const commodities = await getCommoditiesByType(shopStore._id, type, number, 'new');
  const ids = commodities.map((commodity) => commodity._id);
  newCommoditiesIds.value = ids;
}

// 获取最热的商品 id
const getHotCommoditiesIds = async (type: string | undefined, number: number) => {
  const commodities = await getCommoditiesByType(shopStore._id, type, number, 'hot');
  const ids = commodities.map((commodity) => commodity._id);
  hotCommoditiesIds.value = ids;
}

// 监听激活的 tab 的变化更新需要渲染的商品信息
const unwatch = watch(
  active,
  async () => {
    const { grouping } = props.propValue
    const activeCommodities = grouping.find((group) => group.value === active.value);
    if(!activeCommodities) return;
    
    activeCommoditiesInfo.value.order = CommoditiesOrder.Default;

    if(active.value === 'hot') {
      // 热门
      await getHotCommoditiesIds(activeCommodities.type, activeCommodities.showNumber);
      activeCommoditiesInfo.value.ids = Array.from(hotCommoditiesIds.value);
    } else if(active.value === 'new') {
      // 最新
      await getNewCommoditiesIds(activeCommodities.type, activeCommodities.showNumber);
      activeCommoditiesInfo.value.ids = Array.from(newCommoditiesIds.value);
    } else {
      // 默认
      activeCommoditiesInfo.value.ids = activeCommodities.commodities;
      activeCommoditiesInfo.value.order = activeCommodities.order
    }
  },
  {
    immediate: true
  }
);

onUnmounted(() => {
  unwatch();
})
</script>

<style lang="scss" scoped src="./index.scss"></style>