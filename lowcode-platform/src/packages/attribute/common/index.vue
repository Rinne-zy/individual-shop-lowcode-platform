<template>
  <div class="component-common-attr">
    <el-collapse v-model="activeName">
      <el-collapse-item title="通用样式" name="style">
          <el-form label-position="top">
            <el-form-item 
              v-for="(value, key) in selectedComponent.style"
              :key="key"
              :label="labelByStyleKey[key]"
              :name="key"
            >
             <el-input v-model="selectedComponent.style[key]" type="number" @input="onHandleInput" />
            </el-form-item>
          </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue';
import { ElCollapse, ElCollapseItem, ElForm, ElFormItem, ElInput } from 'element-plus';

import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import type { ComponentsSchema } from 'lowcode-platform/store/schema-store';
import { execShapePointsForceUpdate } from 'lowcode-platform/hooks/use-shape-points';

const schemaStore = useSchemaStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema()) as ComputedRef<ComponentsSchema>;

// 激活的下拉面板
const activeName = ref('style');

const labelByStyleKey: Record<string, string> = {
  width: '宽度(单位 px)',
  height: '高度(单位 px)',
  left: 'x 坐标(单位 px)',
  top: 'y 坐标(单位 px)',
  rotate: '旋转角度(单位 deg)',
}

// 处理输入框输入变化
const onHandleInput = () => {
  execShapePointsForceUpdate(schemaStore.selectedComponentSchemaId);
}
</script>

<style scoped></style>