<template>
  <div>
    <nav-bar 
      title="选择地址"
      left-arrow
      @click-left="router.go(-1)"
    />
    <van-address-list  
      v-model="chosenAddressId"
      :list="addressList"
      default-tag-text="默认"
      @add="handleAddAddress"
      @edit="handleEditAddress"
      @select="handleSelectAddress"
    />
    <popup
      v-model:show="isShowEditAddressPopUp"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{
        height: '60%',
        width: '100vw',
        overflow: 'auto',
      }"
    >
      <address-edit
        ref="addressEditRef"
        :is-editing="isEditing"
        @confirm="handleSaveAddress"
        @delete="handleDeleteAddress"
      />
    </popup>
  </div>
</template>

<script setup lang="ts">
import { AddressList as VanAddressList, Popup, NavBar } from 'vant';
import type { AddressListAddress, AddressEditInfo } from 'vant';
import { ref, reactive, computed } from 'vue';
import deepcopy from 'deepcopy';
import { useRouter } from 'vue-router';

import AddressEdit from 'lowcode-platform-h5-renderer/components/address-edit/index.vue';
import type { AddressInfo } from 'lowcode-platform-h5-renderer/type/address';

// 路由
const router = useRouter();

// 当前选择的地址
const chosenAddressId = ref(0);
// 地址详情信息
const address = reactive<AddressInfo[]>([]);

// 用于展示的地址选择器列表
const addressList = computed(() => address.map((address) => {
  const { name, tel, county, city, isDefault, province, addressDetail, id } = address;
  return {
    id,
    name,
    tel,
    address: `${city === province ? province : `${province}${city}`}${county}${addressDetail}`,
    isDefault: isDefault || false,
  }
}));

// 地址选择器 Dom
const addressEditRef = ref<InstanceType<typeof AddressEdit>>();
// 是否展示添加/编辑的地址选择框
const isShowEditAddressPopUp = ref(false);
// 是否正在编辑
const isEditing = ref(false);
// 正在编辑的元素下标
let isEditingIndex = -1;

// 处理添加地址
const handleAddAddress = () => {
  isShowEditAddressPopUp.value = true;
};

// 选择地址
const handleSelectAddress = (item: AddressListAddress, index: number) => {
  console.log('item', item, index);
  // TODO: 接口修改选择地址
  router.push('/cart')
};

// 处理编辑地址
const handleEditAddress = (item: AddressListAddress, index: number) => {
  // 设置正在编辑的数据
  isEditingIndex = index;
  addressEditRef.value?.setAddressInfo(address[isEditingIndex]);
  isEditing.value = true;
  isShowEditAddressPopUp.value = true;
};

// 重置正在编辑状态
const resetEditingStatus = () => {
  addressEditRef.value?.reset();
  isShowEditAddressPopUp.value = false;
  isEditing.value = false;
  isEditingIndex = -1;
};

// 处理添加
const handleSaveAddress = (info: AddressInfo) => {
  // TODO: 设置默认地址需要重置其余的选择
  if(!isEditing.value){
    // TODO: 后续代替为网络请求
    address.push(deepcopy(info));
  } else {
      // TODO: 后续代替为网络请求
    address[isEditingIndex] = deepcopy(info);
  }
  resetEditingStatus();
};

// 处理删除
const handleDeleteAddress = () => {
  // TODO: 使用接口代替删除
  address.splice(isEditingIndex, 1);
  resetEditingStatus();
};

</script>

<style lang="scss" scoped src="./index.scss"></style>