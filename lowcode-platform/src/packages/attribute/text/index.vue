<template>
  <div>
    <el-collapse 
      v-model="activeName"
      accordion
    >
      <common-attr />
      <control-attr 
        :simple-control-options="simpleAttr"
        :select-control-options="selectAttr"
      />
    </el-collapse> 
  </div>
</template>

<script setup lang="ts">
import { ElCollapse } from 'element-plus';
import { ref } from 'vue';

import CommonAttr from '../common/index.vue';
import ControlAttr from '../control/index.vue';
import { BaseControlOption, ControlType, SelectControlOption } from '../control/type';
import { TextPropValue } from '@lowcode-platform/packages/src/components/text/type';

defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object,
    default: () => {},
  }
})

// 激活的 tab
const activeName = ref('style');

// 简单属性（文本输入框、开关）
const simpleAttr: Partial<Record<keyof TextPropValue, BaseControlOption>> = {
  value: {
    type: ControlType.Text,
    label: '文本值',
  },
  fontSize: {
    type: ControlType.Number,
    label: '文本大小(px)',
  },
  color: {
    type: ControlType.Color,
    label: '文本颜色',
  },
  isWarp: {
    type: ControlType.Switch,
    label: '是否换行',
  },
};

// 选择器属性
const selectAttr: Partial<Record<keyof TextPropValue, SelectControlOption>> = {
  position: {
    type: ControlType.Select,
    label: '文本位置',
    options: [
      {
        value: 'left',
        label: '居左'
      },
      {
        value: 'center',
        label: '居中'
      },
      {
        value: 'right',
        label: '居右'
      }
    ]
  },
};
</script>

<style scoped src="./index.scss"></style>