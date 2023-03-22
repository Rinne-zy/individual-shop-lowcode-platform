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
        @click="handleGoToCommodity"
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
import { computed, ref } from "vue";
import type { PropType } from "vue";

import Card from "./card/index.vue";
import { FETCH_URL_PREFIX } from 'lowcode-platform-h5-renderer/const/index';
import { Commodity, CommodityLayout, CommodityPropValue } from "./type";
import { transformPxToVw } from "lowcode-platform-h5-renderer/utils/transform";
import { addCommodityToCart } from "lowcode-platform-h5-renderer/api/shopping-cart";
import { useShopStore } from "lowcode-platform-h5-renderer/store/schema";
import { useCommodityDetailStore } from "lowcode-platform-h5-renderer/store/commodity";
import { useRouter } from "vue-router";

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

const shopStore = useShopStore();
const router = useRouter();
const commodityDetailStore = useCommodityDetailStore();

const commodities = ref([] as Commodity[]);

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
    commodities.value = res;
  }
};
getCommodities();

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
</script>

<style lang="scss" scoped src="./index.scss"></style>
