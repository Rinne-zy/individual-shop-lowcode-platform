<template>
  <div 
    class="cascader-panel"
    v-for="(cascaderOption, index) in cascaderPanelOptions"
    :key="index"
  >
    <div
      class="cascader-panel-item"
      v-for="item in cascaderOption"
      :class="{ isActive: paths.includes(item.value)}"
      :key="item.value"
      @click="handleClickItem(item.value, index + 1)"
    >
      <span>{{ item.label }}</span>
      <span v-if="!item.isLeaf" class="iconfont icon-more" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

import type { CascaderPanelOption } from './type';

const props = defineProps({
  // 级联选择框选项
  options: {
    type: Array as PropType<CascaderPanelOption[][]>,
    default: () => [],
  },
  // 当前选中路径
  paths: {
    type: Array,
    default: () => [],
  }
});

const emits = defineEmits(['expand']);
// 级联面板选项
const cascaderPanelOptions = computed(() => props.options);
// 路径
const paths = computed(() => props.paths);
// 处理点击
const handleClickItem = (value: string, layer: number) => {
  if(!value && !layer) return;
  emits('expand', value, layer);
}

</script>

<style lang="scss" scoped src="./index.scss"></style>