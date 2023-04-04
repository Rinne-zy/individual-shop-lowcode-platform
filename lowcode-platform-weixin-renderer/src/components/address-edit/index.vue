<template>
  <view class="address-form">
    <u-form
      :model="addressInfo"
      ref="addressFormRef"
      labelWidth="60"
		>
			<u-form-item
        label="姓名"
        prop="name"
        borderBottom
			>
				<u-input
          v-model="addressInfo.name"
          placeholder="姓名"
          border="none"
				/>
			</u-form-item>
      <u-form-item
        label="电话"
        prop="tel"
        borderBottom
			>
				<u-input
          v-model="addressInfo.tel"
          placeholder="电话号码"
          border="none"
				/>
			</u-form-item>
      <u-form-item
        label="地区"
        prop="areaCode"
        borderBottom
        @click="isShowAreaPicker = true"
			>
        <u-input
          :model-value="areaInfo"
          disabled
          placeholder="请选择地区"
          border="none"
				/>
        <template #right>
					<u-icon
						name="arrow-right"
					></u-icon>
				</template>
			</u-form-item>
      <u-form-item
        label="详细地址信息"
        prop="addressDetail"
        labelWidth="90"
        borderBottom
			>
				<u-input
          v-model="addressInfo.addressDetail"
          placeholder="详细地址"
          border="none"
				/>
			</u-form-item>
      <u-form-item
        label="是否设置为默认地址"
        labelWidth="130"
        borderBottom
			>
        <u-switch v-model="addressInfo.isDefault" />
			</u-form-item>
		</u-form>
    <view class="address-form-operation">
      <u-button
        v-if="!isEditing"
        round
        block
        type="primary"
        text="新增"
        @click="handleSubmit"
      />
      <view v-else class="group">
        <u-button
          round
          size="small"
          type="primary"
          text="确认修改"
          @click="handleSubmit"
        />
        <view style="width: 20px;" />
        <u-button
          round
          size="small"
          type="error"
          text="删除"
          @click="handleDelete"
        />
      </view>
    </view> 
    <u-popup :show="isShowAreaPicker" mode="bottom"  @close="() => isShowAreaPicker = false">
      <van-area
        title="地区"
        :area-list="areaList"
        :columns-placeholder="['请选择', '请选择', '请选择']"
        @confirm="handleSelectConfirmArea"
        @cancel="isShowAreaPicker = false"
      />
	  </u-popup>   
  </view>
</template>

<script setup lang="ts">
export type AddressEditInfo = {
    tel: string;
    name: string;
    city: string;
    county: string;
    country: string;
    province: string;
    areaCode: string;
    isDefault?: boolean;
    addressDetail: string;
};

import { areaList } from '@vant/area-data';
import { computed, onMounted, reactive, ref } from 'vue';

import type { AddressInfo } from 'lowcode-platform-common/type/address';
import { wxuuid } from 'lowcode-platform-weixin-renderer/utils/wx-uuid';

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: true,
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
// 表单实例
const addressFormRef = ref();
// 是否展示地区选择器
const isShowAreaPicker = ref(false);
// 地区信息 info
const areaInfo = computed(
  () =>{
    if(!addressInfo.areaCode || addressInfo.areaCode === '00000') return '';
    return `${addressInfo.city === addressInfo.province ? addressInfo.province : addressInfo.city}${addressInfo.county}${addressInfo.addressDetail}`
  } 
);

// 处理选择地址
const handleSelectConfirmArea = (value: any) => {
  const { values } = value.target;
  // 若存在未选择的情况
  if(!values.length || values.some((v: any) => !v || v.code === '000000')) {
    addressInfo.areaCode = addressInfo.province = addressInfo.city = addressInfo.county = '';
    isShowAreaPicker.value = false;
    return;
  };
  // 地区代码
  addressInfo.areaCode = values[2].code;
  // 省
  addressInfo.province = values[0].name || '';
  // 市
  addressInfo.city = values[1].name || '';
  // 区
  addressInfo.county = values[2].name || '';
  // 隐藏选择框
  isShowAreaPicker.value = false;
  // 重新校验
  addressFormRef.value.validateField('areaCode')
};

// 校验规则
const rules = {
  name: {
    type: 'string',
    required: true,
    message: '请输入姓名',
    trigger: ['blur']
  },
  tel: {
    type: 'number',
    required: true,
    message: '请输入电话号码',
    trigger: ['blur']
  },
  areaCode: {
    type: 'number',
    required: true,
    message: '请选择地址',
    trigger: ['blur', 'change']
  },
  addressDetail: {
    type: 'string',
    required: true,
    message: '请输入详细地址信息',
    trigger: ['blur']
  },
}

// 确定
const handleSubmit = () => {
  addressFormRef.value.validate().then(() => {
    if(!props.isEditing && !addressInfo.id) {
      addressInfo.id = wxuuid();
    }
    emits('confirm', addressInfo);
  }).catch((error: any) => {
    console.log('校验失败', error);
  })
};
// 删除
const handleDelete = () => {
  uni.showModal({
    title: '删除',
    content: `是否删除当选中的地址: ${areaInfo.value}`,
    success: function (res) {
      if(res.cancel) return;
      emits('delete', addressInfo.id);
    }
  });
};

onMounted(() => {
  addressFormRef.value.setRules(rules);
})

</script>

<style lang="scss" scoped src="./index.scss"></style>