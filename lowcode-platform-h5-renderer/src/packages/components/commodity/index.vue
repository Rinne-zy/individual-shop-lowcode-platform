<template>
  <div>
    <!-- 一行一列或一行多列 -->
    <div 
      v-if="propValue.layout !== CommodityLayout.Two" 
      class="commodity" 
      :class="[propValue.layout]"
    >
      <card
        v-for="commodity in commodities"
        :data-id="commodity._id"
        :key="commodity._id"
        :id="commodity._id"
        :title="commodity.name"
        :cover="commodity.imagesSrc[0]"
        :type="commodityClassByLayout[propValue.layout]"
        :desc="commodity.desc"
        :price="commodity.price * commodity.discount * 0.01"
        :origin-price="commodity.price"
        :is-show-origin-price="propValue.isShowOriginPrice"
        :is-show-desc="propValue.isShowDesc"
        :class="{ round: propValue.isRound }"
        :style="commodityStyleByLayout[propValue.layout]"
        @add="handleAddToCart"
        @click="handleGoToCommodity(commodity._id)"
      />
    </div>
    <!-- 一行两列 -->
    <div 
      v-else
      class="row"
    >
      <div class="column" 
        v-for="data in columnCommodities" 
        :style="commodityStyleByLayout[propValue.layout]"
      >
        <card
          v-for="commodity in data"
          :key="commodity._id"
          :id="commodity._id"
          :data-id="commodity._id"
          :title="commodity.name"
          :cover="commodity.imagesSrc[0]"
          :type="commodityClassByLayout[propValue.layout]"
          :desc="commodity.desc"
          :price="commodity.price * commodity.discount * 0.01"
          :origin-price="commodity.price"
          :is-show-origin-price="propValue.isShowOriginPrice"
          :is-show-desc="propValue.isShowDesc"
          :class="{ round: propValue.isRound }"
          :style="{ marginBottom: `${propValue.padding + 5}px`}"
          @add="handleAddToCart"
          @click="handleGoToCommodity(commodity._id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";

import Card from "./card/index.vue";
import { FETCH_URL_PREFIX } from 'lowcode-platform-common/common/index';
import { Commodity, CommodityLayout, CommodityPropValue } from "./type";
import { transformPxToVw } from "lowcode-platform-common/utils/style";
import { addCommodityToCart } from "lowcode-platform-h5-renderer/api/shopping-cart";
import { useShopStore } from "lowcode-platform-h5-renderer/store/schema";
import { useCommodityDetailStore } from "lowcode-platform-h5-renderer/store/commodity";
import { useRouter } from "vue-router";
import { CommoditiesOrder } from "../grouping/type";

const props = defineProps({
  // 属性值
  propValue: {
    type: Object as PropType<CommodityPropValue>,
    default: () => {},
  },
  // 组件样式
  propStyle: {
    type: Object,
    default: () => {},
  },
  viewportWidth: {
    type: Number,
    default: 375,
  }
});

// 根据商品布局获取对应的类名
const commodityClassByLayout: Record<CommodityLayout, 'inline' | 'vertical' | 'horizon'> = {
  [CommodityLayout.Inline]: 'inline',
  [CommodityLayout.Two]: 'vertical',
  [CommodityLayout.One]: 'horizon',
};

// 根据商品布局获取对应的样式
const commodityStyleByLayout = {
  [CommodityLayout.Inline]: {
    marginRight: transformPxToVw(props.propValue.padding, props.viewportWidth),
  },
  [CommodityLayout.Two]: {
    width: `calc((100% - ${transformPxToVw(props.propValue.padding, props.viewportWidth)}) / 2)`
  },
  [CommodityLayout.One]: {
    marginBottom: transformPxToVw(props.propValue.padding, props.viewportWidth),
  },
}

const shopStore = useShopStore();
const router = useRouter();
const commodityDetailStore = useCommodityDetailStore();

// 原始商品列表
const originCommodities = ref([] as Commodity[]);
// 商品 id
const ids = computed(() => props.propValue.commodities);
// 排序后商品列表
const commodities = computed(() => {
  if(props.propValue.sort === undefined || props.propValue.sort === CommoditiesOrder.Default) {
    return originCommodities.value;
  };

  return originCommodities.value.sort((c1, c2) => {
    if(props.propValue.sort === CommoditiesOrder.Time) {
      return c2.addTime - c1.addTime;
    }

    return c2.sales - c1.sales;
  });
});

// 一行两列分组
const columnCommodities = computed(() => {
  const columns = [[], []] as Array<Commodity[]>;
  commodities.value.forEach((column, index) => {
    const i = index % 2;
    columns[i].push(column);
  });
  return columns;
});

// 获取商品
const getCommodities = async () => {
  if(props.propValue.commodities.length === 0) return;
  const resp = await fetch(`${FETCH_URL_PREFIX}commodity/getByIds`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ids: props.propValue.commodities,
    })
  });
  if(resp.status !== 200 || !resp.ok) throw new Error('获取商城出错');

  const { code, commodities: res } = await resp.json();
  if(!code) {
    originCommodities.value = res;
  }
};

let isAddingToCart = false;
// 添加到购物车中
const handleAddToCart = async (commodityId: string) => {
  if(isAddingToCart) return;
  isAddingToCart = true;
  await addCommodityToCart(shopStore._id, commodityId);
  isAddingToCart = false;
}

// 前往商品详情
const handleGoToCommodity = (commodityId: string) => {
  // 设置商品详情展示所需的信息
  commodityDetailStore.commodityId = commodityId;
  commodityDetailStore.shopId = shopStore._id;

  if(!commodityId || !shopStore._id) return;
  router.push('/commodity');
}

// 监听 id 的变化
watch(
  ids, 
  async () => {
    await getCommodities();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped src="./index.scss"></style>
