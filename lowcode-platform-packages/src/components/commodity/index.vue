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
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { PropType } from "vue";

import Card from "./card/index.vue";
import { Commodity, CommodityLayout, CommodityPropValue } from "./type";

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

const ids = reactive([
  "64006cddcfdd8e7bfdb35765",
  "64017b9ca8b3a8639b52fda9",
  "6401ed2bb6c69fc690a8115f",
  "6401ed47b6c69fc690a81165",
]);

const commodities = ref([] as Commodity[]);

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

// 根据 id 获取相应的商品
const getCommoditiesByIds = async (ids: string[]) => {
  const res = await fetch("http://localhost:3300/commodity/getByIds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ids,
    }),
  });
  if (res.status !== 200 || !res.ok) throw new Error("服务器错误");
  commodities.value = (await res.json()).commodities;
};

getCommoditiesByIds(ids);
</script>

<style lang="scss" scoped src="./index.scss"></style>
