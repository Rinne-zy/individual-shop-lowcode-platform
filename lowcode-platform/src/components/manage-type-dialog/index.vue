<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="title"
    width="80%"
    @closed="handleCancel"
  >
    <div class="type-cascader">
      <TypeCascaderPanel 
        :options="cascaderOptions"
        :paths="paths"
        @expand="handleExpand"
      />
    </div>
    <div class="operation">
      <Transition name="slide-fade">
        <div         
          class="operation-add"
          v-show="isInput"
        >
          <el-input v-model="inputValue" placeholder="请输入新分类标签" />
          <el-button type="primary" style="margin-left: 5px;" @click="handleAdd">确认</el-button>
          <el-button type="danger" style="margin: 0;" @click="handleCancelAdd">取消</el-button>
        </div>
      </Transition>
      <transition name="fade">
        <el-button 
          v-show="!isInput"
          type="primary"
          :disabled="canNotAdd"
          @click="isInput = true"
        >
          添加分类
        </el-button>
      </transition>
      <el-button type="default" @click="handleCancelSelect">取消选择</el-button>
      <el-popconfirm title="请确认是否删除该分类" @confirm="handleDelete">
        <template #reference>
          <el-button 
            type="danger"
            :disabled="canNotDelete"
          >
            删除分类
          </el-button>
        </template>
      </el-popconfirm>
   
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElDialog, ElButton, ElInput, ElPopconfirm } from 'element-plus';
import type { CascaderOption } from 'element-plus'
import { computed, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import deepcopy from 'deepcopy';

import TypeCascaderPanel from './cascader-panel/index.vue';
import type { CascaderPanelOption } from './cascader-panel/type';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '分类管理',
  },
  maxLayer:{
    type:Number,
    default: 2,
  }
});
const emits = defineEmits(['cancel', 'confirm', 'delete', 'add']);
defineExpose({
  // 设置级联选择框内容
  setPropCascaderOption(options: CascaderOption[]){
    paths.value = [];
    cascaderOptions.value = [];
    propCascaderOptionCopy.value = deepcopy(options);
    expandCascaderOptionsAccordingPaths(propCascaderOptionCopy.value);
  }
})

// 传递的级联选择框拷贝
const propCascaderOptionCopy = ref<CascaderOption[]>([]);
// 对话框是否可见
const dialogVisible = computed(() => props.isVisible);
// 级联选择框选项
const cascaderOptions = ref([] as CascaderPanelOption[][]);
// 当前展开的层级路径
const paths = ref([] as string[]);
// 当前展开的子数组
let isExpandArray = [];
// 输入值
const inputValue = ref('');
// 是否正在输入
const isInput = ref(false);
// 是否能添加
const canNotAdd = computed(() => paths.value.length >= props.maxLayer || paths.value[paths.value.length - 1] === 'default');
// 是否能删除
const canNotDelete = computed(() => 
  // 当前未选中任何选项
  paths.value.length <= 0 ||
  // 默认选项无法删除
  paths.value[paths.value.length - 1] === 'default' ||
  // 当前展开包含子数组 
  isExpandArray.length > 0
);

// 根据路径获取相应的级联选项
const findCascaderOptionsByPaths = (options: CascaderOption[]) => {
  let cascaderOptions: CascaderOption[] | undefined = options;
  // 获取对应的级联选项值对应的子数组
  paths.value.forEach((path) => {
    if (!cascaderOptions) return;
    const ops = cascaderOptions.find(({ value }) => value === path);
    cascaderOptions = ops?.children;
  });

  return cascaderOptions;
}

// 根据层级路径展开级联选择器
const expandCascaderOptionsAccordingPaths = (options: CascaderOption[]) => {
  const foundOptions = findCascaderOptionsByPaths(options);
  // 设置当前展开的子数组，若长度为 0 则表示无子数组
  isExpandArray = foundOptions;
  // 未找到相应层级直接返回
  if(!foundOptions || !foundOptions.length) return;

  const cascaderOption = foundOptions.map((option) => ({
    value: option.value as string,
    label: option.label as string,
    isLeaf: !option.children || option.children.length === 0
  }));
  
  // 添加级联选择器
  cascaderOptions.value.push(cascaderOption);
};

// 取消选择
const handleCancelSelect = () => {
  paths.value = [];
  // 只保留第一层级的选项
  cascaderOptions.value = cascaderOptions.value.slice(0, 1);
};
// 处理展开
const handleExpand = (value: string, layer: number) => {
  isInput.value = false;
  // 当记录展开路径长度小于层级，表示需要展开下一级
  if(paths.value.length < layer) {
    paths.value.push(value);
    // 根据当前选中的添加相应的级联选项
    expandCascaderOptionsAccordingPaths(propCascaderOptionCopy.value);
    return;
  };

  // 当记录展开的路径大于或等于层级，表示展开同级或者上一级(此处 -1 因为默认展开第一层时为空)
  paths.value = paths.value.slice(0, layer - 1);
  paths.value.push(value);

  // 裁剪多余的层级 [0, 1）
  cascaderOptions.value = cascaderOptions.value.slice(0, layer);
  // 根据当前选中的添加相应的级联选项
  expandCascaderOptionsAccordingPaths(propCascaderOptionCopy.value);
};
// 处理点击删除
const handleDelete = () => {
  // 默认未分组无法删除
  if(paths.value.length <= 0 || paths.value[paths.value.length - 1] === 'default') {
    return;
  };

  // 裁剪当前层级的数组
  const value = paths.value.pop();
  cascaderOptions.value = cascaderOptions.value.slice(0, paths.value.length);

  // 根据当前路径查找子数组
  const options = findCascaderOptionsByPaths(propCascaderOptionCopy.value);

  // 查找当选选中的层级的父数组
  const index = options?.findIndex((option) => option.value === value);
  if(index === -1) return;

  // 裁剪数组
  options?.splice(index, 1);
  expandCascaderOptionsAccordingPaths(propCascaderOptionCopy.value);
  emits('delete', propCascaderOptionCopy.value, value);
};
// 取消点击
const handleCancelAdd = () => {
  isInput.value = false;
  inputValue.value = '';
}
// 点击添加
const handleAdd = () => {
  if (!inputValue.value) return;
  // 根据当前路径查找子数组
  const options = findCascaderOptionsByPaths(propCascaderOptionCopy.value);
  options.push({
    value: uuidv4(),
    label: inputValue.value,
    children: [],
  })
  cascaderOptions.value = cascaderOptions.value.slice(0, paths.value.length);
  expandCascaderOptionsAccordingPaths(propCascaderOptionCopy.value);
  handleCancelAdd();
  emits('add', propCascaderOptionCopy.value);
}
// 点击取消
const handleCancel = () => {
  handleCancelSelect();
  handleCancelAdd();
  emits('cancel');
};

</script>

<style lang="scss" scoped src="./index.scss"></style>