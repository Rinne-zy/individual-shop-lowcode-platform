<template>
  <div>
    <el-dialog
      :model-value="isVisible"
      title="图片选择"
      width="80%"
      :close-on-click-modal="false"
      align-center
      @close="handleClose"
    >
      <div class="select-dialog-top">
        <!-- 搜索框 -->
        <el-input
            v-model="search"
            placeholder="搜索图片名称"
            class="input-with-select"
          >
            <template #prepend>
              <el-button><i class='iconfont icon-search'/></el-button>
            </template>
        </el-input>
        <el-button type="primary" @click="isUploadImageDialogVisible = true">新增图片</el-button>
      </div>
      <!-- 图片展示 -->
      <el-table 
        :data="picturesNeedToShow"
        ref="table"
        style="width: 100%"
        max-height="600"
        :highlight-current-row="isEditing"
        @current-change="handleCurrentChange"
      >
        <el-table-column v-if="!isEditing" type="selection" width="65" />
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column
          prop="type"
          label="图片分类"
          width="200"
          :filters="filterType"
          :filter-method="handleFilter"
        >
          <template #default="scope">
            {{ typeLabels[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="src" label="图片预览" width="300" >
          <template #default="scope">
            <img :src="scope.row.src" class="image-preview" />
          </template>
        </el-table-column>
        <el-table-column prop="modified" label="修改时间" width="300" >
          <template #default="scope">
            {{ getDate(scope.row.modified) }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 上传 -->
    <upload-image-dialog 
      :is-visible="isUploadImageDialogVisible"
      @success-upload="successUpload"
      @cancel="isUploadImageDialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted, onMounted } from 'vue';
import { ElDialog, ElTable, ElTableColumn, ElInput, ElButton } from 'element-plus';

import UploadImageDialog from 'lowcode-platform/components/upload-image-dialog/index.vue';
import { getImages } from 'lowcode-platform/api/image';
import { StatusCode } from 'lowcode-platform/api/type';
import type { Image } from 'lowcode-platform/api/image';
import { getDate } from 'lowcode-platform/utils/time';
import { useCascaderType } from 'lowcode-platform/hooks/use-cascader-type-hook';
import { useElTableHooks } from 'lowcode-platform/hooks/use-el-table-hook';
import { Type } from 'lowcode-platform/store/type-store';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  }
});

const emits = defineEmits(['close', 'confirm']);

// 图片数据
const pictures = ref<Image[]>([]);
// 上传图片对话框是否可见
const isUploadImageDialogVisible = ref(false);
// 当前选择框是否可见
const isVisible = computed(() => props.isVisible);
// 是否处于编辑状态，编辑状态则为单选模式
const isEditing = computed(() => props.isEditing);

// el-table 表格 hook
const {
  // 表格实例
  table,
  // 搜索字段
  search,
  // 当前单选选中行
  currentRow,
  // 处理单选
  handleCurrentChange,
  // 处理过滤
  handleFilter,
} = useElTableHooks<Image>();

// 类型级联选择框 hook
const {
  // 类型标签
  typeLabels,
  // 初始化
  initCascaderType,
} = useCascaderType(Type.Image);

// 筛选类型
const filterType = computed(() => {
  const types: string[] = []
  pictures.value.forEach((picture) => {
    if(types.includes(picture.type)) return;
    types.push(picture.type);
  })

  return types.map((type) => ({
    text: typeLabels.value[type],
    value: type,
  }))
});

// 需要展示的图片数据
const picturesNeedToShow = computed(() => {
  if(!search.value) {
    return pictures.value;
  };

  return pictures.value.filter((picture) => picture.name.includes(search.value));
});

// 获取远程图片信息
const getRemotePictureSrc = async () => {
  const { data } = await getImages();
  if (!data || data.code !== StatusCode.Success || !data.images) throw new Error(data.msg);
  pictures.value = data.images;
};

// 监听可见获取图片
const stopWatchVisible = watch(isVisible, () =>{
  if(isVisible.value) {
    initCascaderType();
    getRemotePictureSrc();
  }
})

// 成功上传刷新图片列表
const successUpload = () => {
  getRemotePictureSrc();
  isUploadImageDialogVisible.value = false
};

// 处理关闭对话框
const handleClose = () => {
  emits('close');
};
// 处理确认选择
const handleConfirm = () => {
  const selectedRows = table.value?.getSelectionRows() as Image[];
  emits('confirm', isEditing.value ? currentRow.value : selectedRows);
};

onUnmounted(() => {
  stopWatchVisible();
})
</script>

<style lang="scss" scoped src="./index.scss"></style>