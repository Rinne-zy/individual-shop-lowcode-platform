<template>
  <view>
    <view v-if="isLogin" class="shopping-cart">
      <view class="shopping-content">
          <address-item :address-info="addressInfo"/>
          <shopping-cart-card
            class="shopping-content-card"
            v-for="shop in shopsOrderByAddTime"
            :key="shop._id"
            :title="shop.name"
            :id="shop._id"
            :cart-id="shoppingCart._id"
            :commodities="shop.commodities"
            @change-commodity-num="handleChangeCommodityNum"
            @select-commodity="handleSelectCommodity"
            @select-all-commodities="handleSelectShopAllCommodity"
            @delete-commodity="handleDeleteCommodity"
          />
          <view class="tabbar-padding" />
      </view>
      <submit-bar 
        :price="shoppingCart.totalPrice"
        :canSubmit="canSubmit"
        @submit="handleSubmit"
      />
    </view>
    <u-empty
      v-else="isLogin"
      mode="car"
      text="快去登录查看购物车吧"
    />
  </view>

</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { onShow } from "@dcloudio/uni-app";

import SubmitBar from 'lowcode-platform-weixin-renderer/components/submit-tabbar/index.vue';
import ShoppingCartCard from 'lowcode-platform-weixin-renderer/components/shopping-cart-card/index.vue';
import AddressItem from 'lowcode-platform-weixin-renderer/components/address-item/index.vue';
import type { AddressInfo } from 'lowcode-platform-common/type/address';
import { getSelectedAddressInfo } from 'lowcode-platform-weixin-renderer/api/address';
import type { ShoppingCartInfo } from 'lowcode-platform-common/type/commodity';
import { deleteCommodityFromCart, getShoppingCartInfo, selectShopAllCommodities } from 'lowcode-platform-weixin-renderer/api/shopping-cart';
import type { ChangeNumType } from 'lowcode-platform-common/type/shopping-cart';
import { changeCommodityNum, selectCommodity } from 'lowcode-platform-weixin-renderer/api/shopping-cart';
import { useUserStore } from 'lowcode-platform-weixin-renderer/store/user';
import { useOrderStore } from 'lowcode-platform-weixin-renderer/store/order';
import { checkIsLogin } from 'lowcode-platform-weixin-renderer/api/user';
import { navigateTo } from 'lowcode-platform-weixin-renderer/utils/router';

const userStore = useUserStore();
const isLogin = computed(() => userStore.isLogin);
// 地址信息
const addressInfo = reactive<AddressInfo>({
  id: '',
  tel: '',
  name: '',
  city: '',
  county: '',
  country: '',
  province: '',
  areaCode: '',
  isDefault: false,
  addressDetail: '',
});
// 购物车信息
const shoppingCart = reactive<ShoppingCartInfo>({
  _id: '',
  username: '',
  shops: [],
  totalPrice: 0
});
// 根据添加商品时间顺序排序
const shopsOrderByAddTime = computed(() => shoppingCart.shops.sort((s1, s2) => s2.modified - s1.modified));
// 按钮是否正在加载
const isLoading = ref(true);
const canSubmit = computed(() => shoppingCart.totalPrice !== 0);

// 获取选中的地址
const getUserSelectedAddress = async () => {
  const info = await getSelectedAddressInfo();
  if(!info) return;
  Object.assign(addressInfo, info);
};

// 获取购物车
const getShoppingCart = async () => {
  isLoading.value = true;
  const cart = await getShoppingCartInfo();
  isLoading.value = false;
  if(!cart) return;
  Object.assign(shoppingCart, cart);
};


// 处理添加/减少商品数目
let isChangingCommodityNum = false;
const handleChangeCommodityNum = async (shopId: string, commodityId: string, type: ChangeNumType) => {
  // 节流
  if(isChangingCommodityNum) return;

  isChangingCommodityNum = true;
  await changeCommodityNum(shoppingCart._id, shopId, commodityId, type);
  await getShoppingCart();
  isChangingCommodityNum = false;
};

// 处理商品选择
let isSelectingCommodity = false;
const handleSelectCommodity = async (shopId: string, commodityId: string) => {
  //节流
  if(isSelectingCommodity) return;

  isSelectingCommodity = true;
  await selectCommodity(shoppingCart._id, shopId, commodityId);
  await getShoppingCart();
  isSelectingCommodity = false;
};

// 处理选中购物车中该商城所有商品
let isSelectingAll = false;
const handleSelectShopAllCommodity = async (shopId: string) => {
  //节流
  if(isSelectingAll) return;

  isSelectingAll = true;
  await selectShopAllCommodities(shoppingCart._id, shopId);
  await getShoppingCart();
  isSelectingAll = false;
};

// 从购物车中删除商品
let isDeleting = false;
const handleDeleteCommodity = async (shopId: string, commodityId: string,) => {
  if(isDeleting) return;
  isDeleting = true;
  await deleteCommodityFromCart(shoppingCart._id, shopId, commodityId)
  await getShoppingCart();
  isDeleting = false;
}
// 提交订单
const handleSubmit = () => {
  const orderStore = useOrderStore();
  orderStore.addressInfo = addressInfo;
  orderStore.shopsInfo = shopsOrderByAddTime.value;
  orderStore.totalPrice = shoppingCart.totalPrice;

  navigateTo('order');
}

onShow(async () => {
  const isLogin = await checkIsLogin();
  if(!isLogin) return;

  getShoppingCart();
  getUserSelectedAddress();
});
</script>

<style lang="scss" scoped src="./index.scss"></style>