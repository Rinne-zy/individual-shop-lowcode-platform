<template>
  <el-collapse-item title="属性值" name="attr">
    <el-form label-position="top">
      <!-- 组件名称 -->
      <el-form-item 
        label="组件名"
        name="componentName"
      >
        <el-input 
          v-model="selectedComponent.componentName" 
          @change="onHandleChange" 
        />
      </el-form-item>
      <!-- 简单属性部分 -->
      <el-form-item 
        v-for="(value, key) in simpleControlOptions"
        :key="key"
        :label="value.label"
        :name="key"
      >
        <!-- 数字输入框 -->
        <template v-if="value.type === ControlType.Number">
          <el-input 
            v-model="selectedComponent.propValue[key]" 
            :type="value.type" 
            @input="onHandleInput" 
            @change="onHandleChange" 
            />
        </template>
        <!-- 文本输入框 -->
        <template v-else-if="value.type === ControlType.Text">
          <el-input 
            v-model="selectedComponent.propValue[key]" 
            :type="value.type" 
            @input="onHandleInput" 
            @change="onHandleChange" 
            />
        </template>
        <!-- 颜色输入框 -->
        <template v-else-if="value.type === ControlType.Color">
          <el-color-picker 
            v-model="selectedComponent.propValue[key]"
            @change="onHandleChange"  
          />
        </template>
        <!-- 开关 -->
        <template v-else-if="value.type === ControlType.Switch">
          <el-switch 
            v-model="selectedComponent.propValue[key]"
            @change="onHandleChange"
          />
        </template>
        <template v-else-if="value.type === ControlType.Slider">
          <el-slider 
            v-model="(selectedComponent.propValue[key] as any)"
            show-input
            style="padding: 0 10px;"
            :min="0"
            :max="10"
            :step="0.5"
          />
        </template>
      </el-form-item>
      <!-- 选择框属性部分 -->
      <el-form-item 
        v-for="(value, key) in selectControlOptions"
        :key="key"
        :label="value.label"
      >
        <el-select
          v-model="selectedComponent.propValue[key]"
          @change="onHandleChange" 
        >
          <el-option
            v-for="item in value.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 组件定制化属性插槽 -->
      <slot/>
    </el-form>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { computed, ComputedRef, PropType } from 'vue';
import {
  ElCollapseItem,
  ElForm, 
  ElFormItem,
  ElInput,
  ElColorPicker,
  ElSwitch,
  ElSelect,
  ElOption,
  ElSlider,
} from 'element-plus';

import type { BaseControlOption, SelectControlOption } from './type';
import { ControlType} from './type'
import { ComponentsSchema, useSchemaStore } from 'lowcode-platform/store/schema-store';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';
import { execShapePointsForceUpdate } from 'lowcode-platform/hooks/use-shape-points-hook';

defineProps({
  simpleControlOptions:{
    type: Object as PropType<Record<string, BaseControlOption>>,
    default: () => {},
  },
  selectControlOptions:{
    type: Object as PropType<Record<string, SelectControlOption>>,
    default: () => {},
  }
});

const schemaStore = useSchemaStore();
const editorStatusStore = useEditorStatusStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema()) as ComputedRef<ComponentsSchema>;

// 处理输入框输入变化
const onHandleInput = () => {
  execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
}

const onHandleChange = () => {
  // 当属性成功改变并失去焦点时记录快照
  schemaStore.recordSnapshot();
}
</script>

<style scoped></style>