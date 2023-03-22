<template>
  <div class="shopping-cart-card">
    <div class="title">
      <van-checkbox 
        :model-value="isSelectedAll"
        class="title-radio"
        :icon-size="18"
        :disabled="!canSelectAll"
        @click="handleSelectAll"
      />
      <div @click="handleGotoShop">
        <span class="title-text">{{ title }}</span>
        <van-icon class="title-icon" name="arrow" />   
      </div> 
    </div>
    <van-swipe-cell
      v-for="commodity in commodities"
      :key="commodity._id"
    >
      <commodity-card 
        v-bind="commodity"
        @select="handleSelect"
        @change="handleChangeNum"
        @go-to-commodity="handleGoToCommodityDetail"
      />
      <template #right>
        <van-button 
          square 
          text="删除"
          type="danger"
          class="delete-button"
          @click="handleDeleteCommodity(commodity._id, commodity.name)"
        />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script setup lang="ts">
import { Checkbox as VanCheckbox, Icon as VanIcon, SwipeCell as VanSwipeCell, Button as VanButton, showConfirmDialog } from 'vant';
import { computed, PropType } from 'vue';
import { useRouter } from 'vue-router';

import CommodityCard from '../commodity-card/index.vue';
import type { CommodityInfo } from 'lowcode-platform-h5-renderer/type/commodity';
import { CommodityStatus } from 'lowcode-platform-h5-renderer/type/commodity';
import { ChangeNumType } from 'lowcode-platform-h5-renderer/api/shopping-cart';
import { useShopStore } from 'lowcode-platform-h5-renderer/store/schema';
import { TabbarItem } from 'lowcode-platform-h5-renderer/type';
import { useCommodityDetailStore } from 'lowcode-platform-h5-renderer/store/commodity';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: ''
  },
  commodities: {
    type: Array as PropType<CommodityInfo[]>,
    default: () => {},
  }
});
const emits = defineEmits(['changeCommodityNum', 'selectCommodity', 'selectAllCommodities', 'deleteCommodity'])

const router = useRouter();
const commodityDetailStore = useCommodityDetailStore();
// 是否能够选择所有
const canSelectAll = computed(() => props.commodities.every((commodity) => (commodity.status === CommodityStatus.OnSale)));
// 是否选中购物车中该商城全部商品
const isSelectedAll = computed(
  // 选中且正在销售才显示勾选
  () => props.commodities.every((commodity) => (commodity.selected && canSelectAll.value))
);

// 选中全部商品
const handleSelectAll = async () => {
  if(!canSelectAll.value) return
  emits('selectAllCommodities',props.id);
};

// 选中单个商品
const handleSelect = async (commodityId: string) => {
  emits('selectCommodity', props.id, commodityId);
};

// 改变商品数目
const handleChangeNum = async (commodityId: string, type: ChangeNumType) => {
  emits('changeCommodityNum', props.id, commodityId, type);
};

// 处理转跳商城逻辑
const handleGotoShop = async () =>{
  const stop = useShopStore();
  stop.name = props.title;
  stop._id = props.id;
  await stop.getComponents();

  // 前往商城
  stop.activeTabbar = TabbarItem.Home;
  router.push('/');
};

/** 处理前往商品详情 */
const handleGoToCommodityDetail = (commodityId: string) => {
  // 设置商品详情展示所需的信息
  commodityDetailStore.commodityId = commodityId;
  commodityDetailStore.shopId = props.id;

  router.push('/commodity');
};

// 删除商品
const handleDeleteCommodity = (commodityId: string, commodityName: string) => {
  showConfirmDialog({
    title: '删除',
    message:
      `是否删除该商品:${commodityName}`,
    })
    .then(() => {
      emits('deleteCommodity', props.id, commodityId);
    })
    .catch(() => {
    });
}

</script>

<style lang="scss" scoped src="./index.scss"></style>