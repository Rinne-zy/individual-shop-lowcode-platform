<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <!-- 组件属性 -->
      <base-attr :simple-control-options="simpleAttr">
        <!-- 图片地址属性 -->
        <el-form-item label="图片地址">
          <el-select
            style="flex: 67%;"
            v-model="selectedComponent.propValue.src"
            remote
          >
          </el-select>
          <el-button 
            style="flex: 33%;"
            type="primary"
            @click="dialogVisible = true"
          >
            图片上传
          </el-button>
        </el-form-item>
      </base-attr>
    </el-collapse>
    <upload-dialog 
      :is-visible="dialogVisible"
      @confirm="dialogVisible = false"
      @cancel="dialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ElCollapse, ElFormItem,ElSelect, ElButton } from 'element-plus';
import { computed, ComputedRef, PropType, ref } from 'vue';

import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import UploadDialog from './components/upload-dialog.vue';
import { ControlType } from '../base/type';
import type { BaseControlOption } from '../base/type';
import type { ImagePropValue } from '@lowcode-platform/packages/src/components/image/type';
import { useSchemaStore, ComponentsSchema } from 'lowcode-platform/store/schema-store';

defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<ImagePropValue>,
    default: () => {},
  }
})

const schemaStore = useSchemaStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema()) as ComputedRef<ComponentsSchema>;

// 激活的 tab
const activeName = ref('style');

// 简单属性（文本输入框、开关）
const simpleAttr: Partial<Record<keyof ImagePropValue, BaseControlOption>> = {
  isRound: {
    type: ControlType.Switch,
    label: "是否为圆角"
  }
};

const dialogVisible = ref(false);

</script>

<style scoped src="./index.scss"></style>