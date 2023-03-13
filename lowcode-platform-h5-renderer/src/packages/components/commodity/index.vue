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
        :key="commodity._id"
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
</script>

<style lang="scss" scoped src="./index.scss"></style>
