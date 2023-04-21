<template>
  <div class="grouping">
    <TabBar 
      :tab-list="tabBarList"
      v-model="active"
    />
    <!-- 预览部分 -->
    <div v-if="isPreview" class="grouping-commodities">
      <Commodity :is-preview="isPreview" :prop-value="commodityPropValue" />
    </div>
    <!-- 编辑器部分 -->
    <div v-else class="grouping-commodities">
      <div v-if="tabBarList.length === 0">
        <el-empty description="快去添加商品分组吧" />
      </div>
      <div v-else-if="active === 'hot' || 'new'" >
        <el-empty :description="`请点击实时预览查看${ active === 'hot' ? '最热' : '最新' }商品`" />
      </div>
      <div v-else>
        <Commodity :is-preview="isPreview" :prop-value="commodityPropValue" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElEmpty } from 'element-plus';
import { computed, ref, watch, onUnmounted } from 'vue';
import type { PropType } from 'vue';

import TabBar from './tabBar/index.vue';
import Commodity from '../commodity/index.vue';
import { CommoditiesOrder, GroupingPropValue } from './type';
import { useCommodityStore } from 'lowcode-platform/store/commodity-store';
import type { CommodityPropValue } from '../commodity/type';
import { getCommoditiesByType } from 'lowcode-platform/api/commodity';
import { StatusCode } from 'lowcode-platform/api/type';
import { compareTwoArrayIsSame } from 'lowcode-platform/utils/array';

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
const active = props.isPreview ? 
  ref(tabBarList.value[0]?.value || '') : 
  computed(() => {
    if(!tabBarList.value[0]) return ''
    return tabBarList.value[0].value;
  });

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
  // 编辑器界面内无需获取
  if(!props.isPreview) return;
  const { data } = await getCommoditiesByType(type, number, 'new');
  // 防止赋值导致的无限循环
  if(!data || data.code !== StatusCode.Success || !data.commodities || data.commodities.length === 0) return;

  const { commodities } = data;
  commodityStore.addCommodities(commodities);

  const ids = commodities.map((commodity) => commodity._id);
  // 若两者相等不需要触发重新赋值更新视图
  if(compareTwoArrayIsSame(newCommoditiesIds.value, ids, (id, index) => id === ids[index])) {
    return;
  }

  newCommoditiesIds.value = ids;
}

// 获取最热的商品 id
const getHotCommoditiesIds = async (type: string | undefined, number: number) => {
  // 编辑器界面内无需获取
  if(!props.isPreview) return;
  const { data } = await getCommoditiesByType(type, number, 'hot');
  // 防止赋值导致的无限循环
  if(!data || data.code !== StatusCode.Success || !data.commodities || data.commodities.length === 0) return;

  const { commodities } = data;
  commodityStore.addCommodities(commodities);
  
  const ids = commodities.map((commodity) => commodity._id);
  // 若两者相等不需要触发重新赋值更新视图
  if(compareTwoArrayIsSame(hotCommoditiesIds.value, ids, (id, index) => id === ids[index])) {
    return;
  }

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
      activeCommoditiesInfo.value.ids = Array.from(hotCommoditiesIds.value)
    } else if(active.value === 'new') {
      // 最新
      await getNewCommoditiesIds(activeCommodities.type, activeCommodities.showNumber);
      activeCommoditiesInfo.value.ids = Array.from(newCommoditiesIds.value)
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