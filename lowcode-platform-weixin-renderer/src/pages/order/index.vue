<template>
  <view class="order">
    <address-item :address-info="orderStore.addressInfo" :can-select="false"/>
    <u-divider text="订单预览" />
    <view class="order-commodities">
      <order-item
        v-for="(shop, index) in commoditiesSortByShop"
        :key="index"
        :name="shop.name"
        :total-num="shop.num"
        :is-paying="false"
        :commoditiesInfo="shop.commoditiesInfo"
      />
    </view>
    <submit-bar
      submit-bar-text="确定并支付"
      :price="orderStore.totalPrice"
      :canSubmit="commoditiesSortByShop.length > 0"
      @submit="handleSubmit"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import SubmitBar from 'lowcode-platform-weixin-renderer/components/submit-tabbar/index.vue';
import AddressItem from 'lowcode-platform-weixin-renderer/components/address-item/index.vue';
import OrderItem from 'lowcode-platform-weixin-renderer/components/order-item/index.vue';

import { OrderFormType, useOrderStore } from 'lowcode-platform-weixin-renderer/store/order';
import { CommodityStatus } from 'lowcode-platform-common/type/commodity';
import { createOrder, payOrderForm } from 'lowcode-platform-weixin-renderer/api/order';
import { switchTab } from 'lowcode-platform-weixin-renderer/utils/router';

const orderStore = useOrderStore();

// 预览的图片数目
const commoditiesSortByShop = computed(() => {
 return orderStore.shopsInfo.map((shop) => {
    const { name, commodities } = shop;
    let num = 0;
    const commoditiesInfo = commodities.map((commodity) => {
      if(commodity.status !== CommodityStatus.OnSale || !commodity.selected) return null
      num += commodity.number;
      return {
        cover: commodity.cover,
        number: commodity.number,
      }
    }).filter((commodity) => commodity) as { cover: string, number: number}[];
    return {
      name,
      commoditiesInfo,
      num
    }
  }).filter((shop) => shop.commoditiesInfo.length !== 0)
})
// 处理提交订单
const handleSubmit = () => {
  uni.showModal({
    title: '确认',
    content: '是否提交订单',
    success: async function (res) {
      if (res.confirm) {
        const ids = await createOrder();
        pay(ids);
      };
    }
  });
};
// 处理支付
const pay = (id: string | string[]) => {
  uni.showModal({
    title: '确认',
    content: '是否立即支付',
    success: async function (res) {
      if (res.confirm) {
        await payOrderForm(id);
        setTimeout(() => {
          switchTab('shopping-cart');
        }, 1000);
      } else {
        const orderStore = useOrderStore();
        orderStore.activeTab = OrderFormType.Paying;
        uni.redirectTo({
          url: '/pages/my-order/index',
        })
      }
    }
  });
}
</script>

<style lang="scss" scoped src="./index.scss"></style>