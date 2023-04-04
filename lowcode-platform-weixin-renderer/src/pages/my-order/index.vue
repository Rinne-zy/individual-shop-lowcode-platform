<template>
  <view class="my-order">
    <u-sticky bgColor="#fff">
      <u-tabs :list="tabs" :current="currentTab" @click="handleTabSwitch"></u-tabs>
    </u-sticky>
      <order-item 
        v-for="(order, index) in dataToShow.data"
        :key="index"
        :id="order._id"
        :address-info="order.customer.address"
        :total-price="order.totalPrice"
        :commodities-info="order.commodities"
        :name="order.shop.name"
        :ellipsis="dataToShow.ellipsis"
        :isPaying="order.status === OrderStatus.Paying"
        :canFinish="order.status === OrderStatus.Delivering"
        @pay="handlePay"
        @finish="handleFinish"
        @cancel="handleCancel"
      />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

import { cancelOrderForm, getOrderForm, payOrderForm, finishOrder } from 'lowcode-platform-weixin-renderer/api/order';
import { OrderStatus } from 'lowcode-platform-common/type/order';
import type { Order } from 'lowcode-platform-common/type/order';
import OrderItem from 'lowcode-platform-weixin-renderer/components/order-item/index.vue';
import { useOrderStore, OrderFormType } from 'lowcode-platform-weixin-renderer/store/order';

const orderStore = useOrderStore();

// 订单文本
const textByOrderFormType: Record<OrderFormType, string> = {
  [OrderFormType.Paying] : '待付款',
  [OrderFormType.Preparing] : '待发货',
  [OrderFormType.Delivering] : '已发货',
  [OrderFormType.All] : '全部订单',
};

// 订单
const orders = ref<Order[]>([]);
const currentTab = computed(() => {
  const index = Object.keys(textByOrderFormType).findIndex((type: string) => type === orderStore.activeTab.toString());
  if(index === -1) return 3;
  
  return index;
})
// tab 数据
const tabs = [
  {
    name: textByOrderFormType[OrderFormType.Paying],
    key: OrderFormType.Paying,
  },
  {
    name: textByOrderFormType[OrderFormType.Preparing],
    key: OrderFormType.Preparing,
  },
  {
    name: textByOrderFormType[OrderFormType.Delivering],
    key: OrderFormType.Delivering,
  },
  {
    name: textByOrderFormType[OrderFormType.All],
    key: OrderFormType.All,
  },
];
// tab 对应的数据
const tabsData = {
  [OrderFormType.Paying]: {
    type: OrderStatus.Paying,
    ellipsis: false,
  },
  [OrderFormType.Preparing]: {
    type: OrderStatus.Preparing,
    ellipsis: false,
  },
  [OrderFormType.Delivering]: {
    type: OrderStatus.Delivering,
    ellipsis: false,
  },
  [OrderFormType.All]: {
    type: undefined,
    ellipsis: false,
  },
}
// 需要展示的数据
const dataToShow = computed(() => {
  const { type, ellipsis  } = tabsData[orderStore.activeTab];
  const data = type !== undefined ? orders.value.filter((order) => order.status === type) : orders.value;

  return {
    data,
    ellipsis,
  }
});

// 获取订单
const getOrder = async () => {
  const ordersForm = await getOrderForm();
  orders.value = ordersForm.sort((o1, o2) => o2.created - o1.created);
};
// 切换 tab
const handleTabSwitch = (item: any) => {
  orderStore.activeTab = item.key;
  console.log(item.key);
}
// 支付
const handlePay = (id: string, price: number) => {
  uni.showModal({
    title: '支付',
    content:  `确定支付${price}元吗？`,
    success: async function (res) {
      if(res.cancel) return;
      await payOrderForm(id);
      getOrder();
    }
  });
}

// 删除订单
const handleCancel = (id: string) => {
  uni.showModal({
    title: '注意',
    content:  `确定要删除该订单吗？`,
    success: async function (res) {
      if(res.cancel) return;
      await cancelOrderForm(id);
      getOrder();
    }
  });
};

// 确认收货
const handleFinish = (id: string) => {
  uni.showModal({
    title: '确认收货',
    content:  `确定当前订单已经收货了么？`,
    success: async function (res) {
      if(res.cancel) return;
      await finishOrder(id);
      getOrder();
    }
  });
}

onLoad(() => {
  getOrder();
})
</script>

<style lang="scss" scoped src="./index.scss"></style>