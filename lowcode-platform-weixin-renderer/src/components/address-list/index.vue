<template>
  <view class="address-list">
    <u-radio-group v-model="selectedId">
      <view
        v-for="(addressInfo, index) in addressList"
        :key="addressInfo.id"
        class="address-list-item"
      >
        <view class="address-list-item-checkbox">
          <u-radio
            :name="addressInfo.id"
            @change="handleChangeSelect(addressInfo, index)"
          />
        </view>
        <view class="address-list-item-text">
          <view class="individual">
            <text class="individual-text">{{ addressInfo.name }} {{ addressInfo.tel }}</text>
            <u-tag v-if="addressInfo.isDefault" text="默认" size="mini" shape="circle" />
          </view>
          <text class="address">{{ addressInfo.address }}</text>
        </view>
        <view
          class="address-list-item-edit"
          @click="handleEdit(addressInfo, index)"
        >
          <u-icon name="edit-pen" size="24" />
        </view>
      </view>
    </u-radio-group>
  </view>
</template>

<script setup lang="ts">
import type { AddressListAddress } from 'lowcode-platform-weixin-renderer/types/address';
import { onMounted, ref, type PropType } from 'vue';

const props = defineProps({
  addressList: {
    type: Array as PropType<AddressListAddress[]>,
    default: () => [],
  },
  selectedAddressId: {
    type: String,
    default: '',
  }
});

const selectedId = ref<string | number>(props.selectedAddressId)

const emits = defineEmits(['select', 'edit']);
// 点击选择
const handleChangeSelect = (addressInfo: AddressListAddress, index: number) => {
  emits('select', addressInfo);
};
// 点击编辑
const handleEdit = (addressInfo: AddressListAddress, index: number) => {
  emits('edit', addressInfo, index);
};

onMounted(() => {
  selectedId.value = props.selectedAddressId;
})

</script>

<style lang="scss" scoped src="./index.scss"></style>