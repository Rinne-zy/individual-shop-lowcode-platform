<template>
 <el-collapse-item class="component-common-attr" title="通用样式" name="style">
    <el-form label-position="top">
      <el-form-item 
        v-for="(value, key) in commonAttr"
        :key="key"
        :label="labelByStyleKey[key]"
        :name="key"
      >
        <el-input v-model="selectedComponent.style[key]" type="number" @input="onHandleInput" @change="onHandleChange" />
      </el-form-item>
      <el-form-item
        v-if="schemaStore.isFixLayoutMode()"
        label="是否开启等比例放缩"
        name="isProportion"
      >
        <el-switch v-model="selectedComponent.isProportion" />
      </el-form-item>
      <el-form-item
        v-else
        label="是否非独占一行"
        name="inline"
      >
        <el-switch v-model="selectedComponent.inline" />
      </el-form-item>
    </el-form>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { ElCollapseItem, ElForm, ElFormItem, ElInput, ElSwitch } from 'element-plus';

import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import type { ComponentsSchema } from 'lowcode-platform/store/schema-store';
import { execShapePointsForceUpdate } from 'lowcode-platform/hooks/use-shape-points-hook';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';
import type { CommonStyleSchema } from 'lowcode-platform/packages/types';

const schemaStore = useSchemaStore();
const editorStatusStore = useEditorStatusStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema()) as ComputedRef<ComponentsSchema>;

// 通用属性
const commonAttr = computed(() => {
  const attr = {} as Record<keyof CommonStyleSchema, string | number>;
  Object.keys(labelByStyleKey.value).forEach((key) => {
    const styleKey = key as keyof CommonStyleSchema;
    const value =  selectedComponent.value.style[styleKey];
    // undefined 表示不关心属性，直接去掉
    if(typeof value === 'undefined') return;
    attr[styleKey] = selectedComponent.value.style[styleKey];
  })
  return attr;
})

const labelByStyleKey = computed(() => {
  if(schemaStore.isFixLayoutMode()) {
    return {
      width: '宽度(单位 px)',
      height: '高度(单位 px)',
      left: 'x 坐标(单位 px)',
      top: 'y 坐标(单位 px)',
      rotate: '旋转角度(单位 deg)',
    }
  } else {
    return {
      width: '宽度(单位 px)',
      height: '高度(单位 px)',
      marginLeft: '左边距(单位 px)',
      marginRight: '右边距(单位 px)',
      marginTop: '上边距(单位 px)',
      marginBottom: '下边距(单位 px)',
      rotate: '旋转角度(单位 deg)',
    }
  }
})

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