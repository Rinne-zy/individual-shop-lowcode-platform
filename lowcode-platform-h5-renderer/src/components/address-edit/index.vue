<template>
  <div class="address-form">
    <van-form
      @submit="handleSubmit"
    >
      <van-cell-group inset>
        <van-field
          v-model="addressInfo.name"
          name="name"
          label="姓名"
          placeholder="姓名"
          :rules="[{ required: true, message: '请填写名称' }]"
        />
        <van-field
          v-model="addressInfo.tel"
          name="tel"
          label="电话"
          placeholder="电话"
          :rules="[{ required: true, message: '请填写电话' }]"
        />
        <van-field
          v-model="addressInfo.areaCode"
          is-link
          readonly
          name="code"
          label="地区"
          placeholder="点击选择城市"
          :rules="[{ validator: validateAreaInfo, message: '请选择地区信息' }]"
          :formatter="() => areaInfo"
          @click="isShowAreaPicker = true"
          
        />
        <van-field
          v-model="addressInfo.addressDetail"
          name="addressDetail"
          label="详细地址信息"
          placeholder="详细地址"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        />
      </van-cell-group>
      <van-cell-group inset class="address-default-switch">
        <van-field
          v-model="addressInfo.areaCode"
          name="isDefault"
          label="是否设置为默认地址"
          label-width="14.2rem"
        >
          <template #input>
            <van-switch v-model="addressInfo.isDefault"></van-switch>
          </template>
        </van-field>
      </van-cell-group>
      <div class="address-form-operation">
        <van-button
          v-if="!isEditing"
          round
          block
          type="primary"
          native-type="submit"
        >
          新增
        </van-button>
        <div
          class="group"
          v-else
        >
          <van-button
            round
            block
            size="small"
            class="operation-button"
            type="primary"
            native-type="submit"
          >
            确认修改
          </van-button>
          <van-button
            round
            block
            size="small"
            class="operation-button address-form-operation-delete"
            type="danger"
            @click="handleDelete"
          >
            删除
          </van-button>
        </div>
      </div>
    </van-form>
  </div>
  <van-popup 
    v-model:show="isShowAreaPicker" 
    position="bottom"
  >
    <van-area
      title="地区"
      :area-list="areaList"
      :columns-placeholder="['请选择', '请选择', '请选择']"
      @confirm="handleSelectConfirmArea"
      @cancel="isShowAreaPicker = false"
    /> 
  </van-popup>
</template>

<script setup lang="ts">
import { 
  Form as VanForm,
  Button as VanButton,
  Field as VanField,
  CellGroup as VanCellGroup,
  Popup as VanPopup,
  Area as VanArea,
  Switch as VanSwitch,
  showConfirmDialog
} from 'vant';
import type { AddressEditInfo } from 'vant';
import { areaList } from '@vant/area-data';
import { computed, reactive, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import type { AddressInfo } from 'lowcode-platform-common/type/address';

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['confirm', 'cancel', 'delete']);

defineExpose({
  setAddressInfo(info: AddressEditInfo) {
    Object.assign(addressInfo, info);
  },
  reset() {
    Object.assign(addressInfo, defaultAddress)
  }
});

// 默认地址
const defaultAddress = {
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
};
// 地址表单数据
const addressInfo = reactive<AddressInfo>({...defaultAddress});

// 是否展示地区选择器
const isShowAreaPicker = ref(false);
// 地区信息 info
const areaInfo = computed(
  () => `${addressInfo.city === addressInfo.province ? addressInfo.province : addressInfo.city}${addressInfo.county}${addressInfo.addressDetail}`
);

// 校验地区信息
const validateAreaInfo = (value: string) => (!!value && value !== '00000');
// 处理选择地址
const handleSelectConfirmArea = (value: any) => {
  const { selectedOptions, selectedValues } = value;

  // 若存在未选择的情况
  if(!selectedOptions.length || selectedValues.some((v: string) => v === '000000')) return;
  // 地区代码
  addressInfo.areaCode = selectedValues[2];
  // 省
  addressInfo.province = selectedOptions[0].text || '';
  // 市
  addressInfo.city = selectedOptions[1].text || '';
  // 区
  addressInfo.county = selectedOptions[2].text || '';
  // 隐藏选择框
  isShowAreaPicker.value = false;
};

// 确定
const handleSubmit = () => {
  if(props.isEditing &&!addressInfo.id) {
    addressInfo.id = uuidv4();
  }
  emits('confirm', addressInfo);
};
// 删除
const handleDelete = () => {
  showConfirmDialog({
  title: '删除',
  message:
    `是否删除当选中的地址: ${areaInfo.value}`,
  })
  .then(() => {
    emits('delete', addressInfo.id);
  })
  .catch(() => {
  });
};

</script>

<style lang="scss" scoped src="./index.scss"></style>