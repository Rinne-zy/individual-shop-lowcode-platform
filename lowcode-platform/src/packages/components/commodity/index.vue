<template>
  <div>
    <div class="commodity" :class="[propValue.layout]">
      <card
        v-for="commodity in commodities"
        :key="commodity._id"
        :title="commodity.name"
        :cover="commodity.imagesSrc[0]"
        :type="commodityClass"
        :desc="commodity.desc"
        :price="commodity.price * commodity.discount * 0.01"
        :origin-price="commodity.price"
        :is-show-origin-price="propValue.isShowOriginPrice"
        :is-show-desc="propValue.isShowDesc"
        :class="{ round: propValue.isRound }"
        :style="commodityStyle"
      />
    </div>
    <div v-if="commodities.length === 0" class="commodity one-line-one-commodity">
      <card 
        title="测试商品"
        cover="/cover.png"
        desc="我是测试商品的描述"
        :price="100"
        :origin-price="80"
        :style="{
          marinBottom: '10px'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";

import Card from "./card/index.vue";
import { Commodity, CommodityLayout, CommodityPropValue } from "./type";
import { useCommodityStore } from "lowcode-platform/store/commodity-store";

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
});

const commodityStore = useCommodityStore();
const commodities = ref([] as Commodity[]);

// 商品分类
const commodityClass = computed(() => {
  switch (props.propValue.layout) {
    case CommodityLayout.Inline:
      return "inline";
    case CommodityLayout.Two:
      return "vertical";
    case CommodityLayout.One:
      return "horizon";
  }
});

// 商品 id
const ids = computed(() => props.propValue.commodities);

// 监听 id 的变化
watch(
  ids, 
  async () => {
    commodities.value = await commodityStore.getCommoditiesByIds(ids.value);
  },
  { deep: true, immediate: true }
);

// 商品之间的间距
const commodityStyle = computed(() => {
  switch (props.propValue.layout) {
    case CommodityLayout.One:
      return {
        marginBottom: `${props.propValue.padding}px`,
      };
    case CommodityLayout.Two:
      return {
        width: `calc((100% - ${props.propValue.padding}px) / 2)`,
        height: "300px",
      };
    case CommodityLayout.Inline:
      return {
        marginRight: `${props.propValue.padding}px`,
      };
  }
});

</script>

<style lang="scss" scoped src="./index.scss"></style>
