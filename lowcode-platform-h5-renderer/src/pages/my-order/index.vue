<template>
  <div class="my-order">
    <nav-bar 
      title="我的订单"
      left-arrow
      @click-left="router.replace('/info')"
    />
    <van-tabs v-model:active="orderStore.activeTab">
      <van-tab :title="textByOrderFormType[OrderFormType.Paying]" :name="OrderFormType.Paying">
        <order-item 
          v-for="(order, index) in payingOrderForms"
          :key="index"
          is-paying
          :id="order._id"
          :address-info="order.customer.address"
          :total-price="order.totalPrice"
          :commodities-info="order.commodities"
          :name="order.shop.name"
          :ellipsis="false"
          @pay="handlePay"
          @cancel="handleCancel"
        />
      </van-tab>
      <van-tab :title="textByOrderFormType[OrderFormType.Preparing]" :name="OrderFormType.Preparing">
        <order-item 
          v-for="(order, index) in preparingOrderForms"
          :key="index"
          :id="order._id"
          :address-info="order.customer.address"
          :total-price="order.totalPrice"
          :commodities-info="order.commodities"
          :name="order.shop.name"
          :ellipsis="false"
        />
      </van-tab>
      <van-tab :title="textByOrderFormType[OrderFormType.Delivering]" :name="OrderFormType.Delivering">
        <order-item 
          v-for="(order, index) in deliveringOrderForms"
          :key="index"
          :id="order._id"
          :address-info="order.customer.address"
          :total-price="order.totalPrice"
          :commodities-info="order.commodities"
          :name="order.shop.name"
          :ellipsis="false"
          :can-finish="true"
          @finish="handleFinish"
        />
      </van-tab>
      <van-tab :title="textByOrderFormType[OrderFormType.All]" :name="OrderFormType.All">
        <order-item 
          v-for="(order, index) in orders"
          :key="index"
          :id="order._id"
          :is-paying="order.status === OrderStatus.Paying"
          :address-info="order.customer.address"
          :total-price="order.totalPrice"
          :commodities-info="order.commodities"
          :name="order.shop.name"
          :ellipsis="false"
          @pay="handlePay"
          @cancel="handleCancel"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { Tab as VanTab, Tabs as VanTabs, NavBar, showConfirmDialog } from 'vant';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { cancelOrderForm, getOrderForm, payOrderForm, finishOrder } from 'lowcode-platform-h5-renderer/api/order';
import { OrderStatus } from 'lowcode-platform-common/type/order';
import type { Order } from 'lowcode-platform-common/type/order';
import OrderItem from 'lowcode-platform-h5-renderer/components/order-item/index.vue';
import { useOrderStore, OrderFormType } from 'lowcode-platform-h5-renderer/store/order';

const orderStore = useOrderStore();

// 订单文本
const textByOrderFormType: Record<OrderFormType, string> = {
  [OrderFormType.Paying] : '待付款',
  [OrderFormType.Preparing] : '待发货',
  [OrderFormType.Delivering] : '已发货',
  [OrderFormType.All] : '全部订单',
};

const router = useRouter();
// 订单
const orders = ref<Order[]>([]);
const payingOrderForms = computed(() => orders.value.filter((order) => order.status === OrderStatus.Paying));
const preparingOrderForms = computed(() => orders.value.filter((order) => order.status === OrderStatus.Preparing));
const deliveringOrderForms = computed(() => orders.value.filter((order) => order.status === OrderStatus.Delivering));

// 获取订单
const getOrder = async () => {
  const ordersForm = await getOrderForm();
  orders.value = ordersForm.sort((o1, o2) => o2.created - o1.created);
};
getOrder();

// 支付
const handlePay = (id: string, price: number) => {
  showConfirmDialog({
    title: '支付',
    message:
      `确定支付${price}元吗？`,
    })
    .then(async () => {
      await payOrderForm(id);
      getOrder();
    })
    .catch(() => {
    })
}

// 删除订单
const handleCancel = (id: string) => {
  showConfirmDialog({
    title: '注意',
    message:
      '确定要删除该订单吗？',
    })
    .then(async () => {
      await cancelOrderForm(id);
      getOrder();
    })
    .catch(() => {
    })
};

// 确认收货
const handleFinish = (id: string) => {
  showConfirmDialog({
    title: '确认收货',
    message:
      '确定当前订单已经收货了么？',
    })
    .then(async () => {
      await finishOrder(id);
      getOrder();
    })
    .catch(() => {
    })
}
</script>

<style lang="scss" scoped src="./index.scss"></style>