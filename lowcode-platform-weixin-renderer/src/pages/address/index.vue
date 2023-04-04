<template>
  <view class="address">
    <address-list
      :selected-address-id="chosenAddressId"
      :address-list="addressList"
      @edit="handleEditAddress"
      @select="handleSelectAddress"
    />
    <u-popup 
      :show="isShowEditAddressPopUp"
      @close="resetEditingStatus"
      :round="10"
      mode="bottom"
    >
      <view>
        <address-edit
          ref="addressEditRef"
          :is-editing="isEditing"
          @confirm="handleSaveAddress"
          @delete="handleDeleteAddress"
        />
      </view>
    </u-popup>
    <view class="add-address-btn">
      <u-button text="新增地址" @click="handleAddAddress" type="primary"/>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

import AddressList from 'lowcode-platform-weixin-renderer/components/address-list/index.vue';
import AddressEdit from 'lowcode-platform-weixin-renderer/components/address-edit/index.vue';
import type { AddressInfo, UserAddress } from 'lowcode-platform-common/type/address';
import { addAddressInfo, deleteAddressInfo, getAddressInfo, selectAddressInfo, updateAddressInfo } from 'lowcode-platform-weixin-renderer/api/address'
import type { AddressListAddress } from 'lowcode-platform-weixin-renderer/types/address';
import { switchTab } from 'lowcode-platform-weixin-renderer/utils/router';

// 用户地址记录
const userAddress = reactive<UserAddress>({
  _id: '',
  username: '',
  selectedAddressId: '',
  defaultAddressId: '',
  address: [],
});
// 默认地址
const defaultAddressId = computed(() => userAddress.defaultAddressId)
// 当前选择的地址
const chosenAddressId = computed(() => userAddress.selectedAddressId);
// 用于展示的地址选择器列表
const addressList = computed(() => userAddress.address.map((address) => {
  const { name, tel, county, city, province, addressDetail, id } = address;
  return {
    id,
    name,
    tel,
    address: `${city === province ? province : `${province}${city}`}${county}${addressDetail}`,
    isDefault: defaultAddressId.value === id,
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

let isClickSelect = false;
// 选择地址
const handleSelectAddress = async (item: AddressListAddress) => {
  // 已选中相同不进行操作
  if(item.id === chosenAddressId.value) {
    return;
  }

  // 节流
  if(isClickSelect) {
    return;
  };

  isClickSelect = true;
  await selectAddressInfo(userAddress._id, `${item.id}`);
  isClickSelect = false;
  setTimeout(() => {
    switchTab('shopping-cart');
  }, 1000);
};

// 处理编辑地址
const handleEditAddress = (item: AddressListAddress, index: number) => {
  // 设置正在编辑的数据
  isEditingIndex = index;
  isEditing.value = true;
  isShowEditAddressPopUp.value = true;
  // 由于此处 popUp 懒加载原因，因此需要在 nextTick 时才能获取到 domRef
  nextTick(() => {
    addressEditRef.value?.setAddressInfo({
      ...userAddress.address[isEditingIndex],
      isDefault: userAddress.address[isEditingIndex].id === defaultAddressId.value
    });
  })
};

// 重置正在编辑状态
const resetEditingStatus = () => {
  addressEditRef.value?.reset();
  isShowEditAddressPopUp.value = false;
  isEditing.value = false;
  isEditingIndex = -1;
};

// 处理添加
const handleSaveAddress =  async (info: AddressInfo) => {
  if(!isEditing.value){
    await addAddressInfo(info);
  } else {
    await updateAddressInfo(userAddress._id, info);
  }
  getAddress();
  resetEditingStatus();
};

// 处理删除
const handleDeleteAddress = async (id: string) => {
  if(!id) return
  await deleteAddressInfo(userAddress._id, id);
  resetEditingStatus();
  getAddress();
};

// 获取地址
const getAddress = async () => {
  const info = await getAddressInfo();
  if(!info) return;
  Object.assign(userAddress, info);
};

onLoad(() => {
  getAddress();
})
</script>

<style lang="scss" scoped src="./index.scss"></style>