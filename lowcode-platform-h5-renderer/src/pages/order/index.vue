<template>
  <div class="order">
    <nav-bar 
      title="提交订单"
      left-arrow
      @click-left="router.go(-1)"
    />
    <address-item :address-info="orderStore.addressInfo" :can-select="false"/>
    <van-divider>订单预览</van-divider>
    <div class="order-commodities">
      <order-item
        v-for="(shop, index) in commoditiesSortByShop"
        :key="index"
        :name="shop.name"
        :total-num="shop.num"
        :is-paying="false"
        :commoditiesInfo="shop.commoditiesInfo"
      />
    </div>
    <van-submit-bar 
      class="submit-bar"
      :price="orderStore.totalPrice * 100"
      button-text="确定并支付"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SubmitBar as VanSubmitBar, Divider as VanDivider, NavBar, showConfirmDialog } from 'vant';
import { useRouter } from 'vue-router';

import AddressItem from 'lowcode-platform-h5-renderer/components/address-item/index.vue';
import OrderItem from 'lowcode-platform-h5-renderer/components/order-item/index.vue';

import { OrderFormType, useOrderStore } from 'lowcode-platform-h5-renderer/store/order';
import { CommodityStatus } from 'lowcode-platform-common/type/commodity';
import { createOrder, payOrderForm } from 'lowcode-platform-h5-renderer/api/order';

const orderStore = useOrderStore();
const router = useRouter();
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
  showConfirmDialog({
    title: '确认',
    message: '是否提交订单',
  })
    .then(async () => {
      const ids = await createOrder();
      pay(ids);
    })
    .catch(() => { });

  return;
};

const pay = (id: string | string[]) => {
  showConfirmDialog({
    title: '确认',
    message: '是否立即支付',
  })
    .then(async () => {
      await payOrderForm(id);
      router.go(-1);
    })
    .catch(() => {
      const orderStore = useOrderStore();
      orderStore.activeTab = OrderFormType.Paying;
      router.replace('/my-order');
    });
}
</script>

<style lang="scss" scoped src="./index.scss"></style>