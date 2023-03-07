<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <base-attr 
        :simple-control-options="simpleAttr"
        :select-control-options="selectAttr"
      >
      </base-attr>
      <el-collapse-item title="商品选择">
        <div class="select-commodity-area">
          <div class="select-commodity-area-top">
            <el-radio-group v-model="commodityOrder">
              <el-radio :label="true" size="large">自动排序</el-radio>
              <el-radio :label="false" size="large">手动排序</el-radio>
            </el-radio-group>
          </div>
          <div class="select-commodity-area-bottom">
            
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem, ElRadio, ElRadioGroup } from 'element-plus';
import { ref } from 'vue';
import type { PropType } from 'vue';

import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import DraggableImageList from 'lowcode-platform/components/draggable-image-list/index.vue';
import type { CommodityPropValue } from '@lowcode-platform/packages/src/components/commodity/type';
import { ControlType, SelectControlOption } from '../base/type';
import type { BaseControlOption } from '../base/type';

defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<CommodityPropValue>,
    default: () => {},
  }
})

const activeName = ref('style');

// 简单属性（文本输入框、开关）
const simpleAttr: Partial<Record<keyof CommodityPropValue, BaseControlOption>> = {
  padding: {
    type: ControlType.Slider,
    label: '商品间隔',
    options: {
      min: 0,
      max: 20,
      step: 1,
    },
  },
  isRound: {
    type: ControlType.Switch,
    label: "是否为圆角" 
  },
  isShowDesc: {
    type: ControlType.Switch,
    label: "是否展示详细信息"
  },
  isShowOriginPrice: {
    type: ControlType.Switch,
    label: "是否显示原始价格（非一行多个可用）"
  }
};

// 选择器属性
const selectAttr: Partial<Record<keyof CommodityPropValue, SelectControlOption>> = {
  layout: {
    type: ControlType.Select,
    label: '商品布局',
    options: [
      {
        value: 'one-line-one-commodity',
        label: '一行一个'
      },
      {
        value: 'one-line-two-commodity',
        label: '一行两个'
      },
      {
        value: 'inline-commodity',
        label: '一行多个'
      }
    ]
  }
};

// 商品排序模式
const commodityOrder = ref(false);
</script>

<style scoped>

</style>