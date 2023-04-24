<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <base-attr
        :simple-control-options="simpleAttr"
      />
      <el-collapse-item title="富文本编辑器">
        <rich-text-editor 
          v-model="selectedComponent.propValue.content"
          @change="handleChange"
          @blur="handleBlur"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem, } from 'element-plus';
import { ComputedRef, PropType, computed } from 'vue';
import { ref } from 'vue';

import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import RichTextEditor from 'lowcode-platform/components/rich-text-editor/index.vue';
import type { RichTextPropValue } from 'lowcode-platform/packages/components/richText/type';
import { useSchemaStore, ComponentsSchema } from 'lowcode-platform/store/schema-store';
import { ControlType } from '../base/type';
import type { BaseControlOption } from '../base/type';
import { execShapePointsForceUpdate } from 'lowcode-platform/hooks/use-shape-points-hook';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';

const props = defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<RichTextPropValue>,
    default: () => {},
  }
})
const schemaStore = useSchemaStore();
const editorStatusStore = useEditorStatusStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema()) as ComputedRef<ComponentsSchema>;

// 激活的 tab
const activeName = ref('style');

// 上一次输入的内容
let lastContent = props.propValue.content;

// 简单属性（文本输入框、开关）
const simpleAttr: Partial<Record<keyof RichTextPropValue, BaseControlOption>> = {
  fontSize: {
    type: ControlType.Number,
    label: '文本大小(px)',
  },
};
// 处理输入改变
const handleChange = () => {
  execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
}

// 处理取消焦点
const handleBlur = (content: string) => {
  // 避免重复记录
  if(content === lastContent && props.propValue.content === lastContent) {
    return;
  }

  lastContent = props.propValue.content;
  schemaStore.recordSnapshot();
}
</script>

<style scoped>

</style>