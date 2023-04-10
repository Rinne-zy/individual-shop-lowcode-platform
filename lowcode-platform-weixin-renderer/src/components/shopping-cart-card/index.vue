<template>
  <view class="shopping-cart-card">
    <view class="title">
      <view class="title-radio">
        <u-checkbox-group>
          <u-checkbox
            :disabled="!canSelectAll"
            :checked="isSelectedAll"
            @change="handleSelectAll"
          />
        </u-checkbox-group>
      </view>
      <view @click="handleGotoShop">
        <text class="title-text">{{ title }}</text>
        <van-icon class="title-icon" name="arrow" />   
      </view> 
    </view>
      <u-swipe-action>
        <u-swipe-action-item
          v-for="(commodity, index) in commodities"
          :index="index"
          :key="commodity._id"
          :options="[{
            text: '删除',
            style: {
              backgroundColor: '#f56c6c'
            }
          }]"
          @click="handleDeleteCommodity(commodity._id, commodity.name)"
        >
        <commodity-card 
          v-bind="commodity"
          @select="handleSelect"
          @change="handleChangeNum"
          @go-to-commodity="handleGoToCommodityDetail"
        />
        </u-swipe-action-item>
    </u-swipe-action>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

import CommodityCard from '../commodity-card/index.vue';
import type { CommodityInfo } from 'lowcode-platform-common/type/commodity';
import { CommodityStatus } from 'lowcode-platform-common/type/commodity';
import type { ChangeNumType } from 'lowcode-platform-common/type/shopping-cart';
import { useShopStore } from 'lowcode-platform-weixin-renderer/store/schema';
import { useCommodityDetailStore } from 'lowcode-platform-weixin-renderer/store/commodity';
import { navigateTo, switchTab } from 'lowcode-platform-weixin-renderer/utils/router';

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

const commodityDetailStore = useCommodityDetailStore();
// 是否能够选择所有
const canSelectAll = computed(() => props.commodities.every((commodity) => (commodity.status === CommodityStatus.OnSale)));
// 是否选中购物车中该商城全部商品
const isSelectedAll = computed(
  // 选中且正在销售才显示勾选
  () => props.commodities.every((commodity) => (commodity.selected && canSelectAll.value))
);

// 选中全部商品
const handleSelectAll = () => {
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
  await stop.getShop();
  switchTab('shop');
};

/** 处理前往商品详情 */
const handleGoToCommodityDetail = (commodityId: string) => {
  // 设置商品详情展示所需的信息
  commodityDetailStore.commodityId = commodityId;
  commodityDetailStore.shopId = props.id;

  navigateTo('commodity')
};

// 删除商品
const handleDeleteCommodity = (commodityId: string, commodityName: string) => {
  uni.showModal({
    title: '删除',
    content: `是否删除该商品:${commodityName}`,
    success: function (res) {
      if(res.cancel) return;
      emits('deleteCommodity', props.id, commodityId);
    }
  });
}

</script>

<style lang="scss" scoped src="./index.scss"></style>