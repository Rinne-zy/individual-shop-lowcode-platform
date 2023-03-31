<template>
  <view>
    <!-- 一行一列或一行多列 -->
    <view 
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
    </view>
    <!-- 一行两列 -->
    <view 
      v-else
      class="row"
    >
      <view class="column" 
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
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { PropType } from "vue";

import Card from "./card/index.vue";
import { CommodityLayout } from "./type";
import type { Commodity, CommodityPropValue } from "./type";
import { transformPxToVw } from "lowcode-platform-common/utils/style";
import { addCommodityToCart } from "lowcode-platform-weixin-renderer/api/shopping-cart";
import { useShopStore } from "lowcode-platform-weixin-renderer/store/schema";
import { useCommodityDetailStore } from "lowcode-platform-weixin-renderer/store/commodity";
import { post } from "lowcode-platform-weixin-renderer/api/request";

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
  const resp = await post({
    url: 'commodity/getByIds',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      ids: props.propValue.commodities,
    }
  });

  const { code, commodities: res } = await resp as any;
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
  // TODO: 前往商品详情页
}
</script>

<style lang="scss" scoped src="./index.scss"></style>
