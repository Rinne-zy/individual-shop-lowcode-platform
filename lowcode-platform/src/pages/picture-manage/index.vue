<template>
  <div class="picture-manage">
    <div class="picture-manage-top">
      <!-- 搜索框 -->
      <el-input
        v-model="search"
        placeholder="搜索图片名称"
        class="input-with-select"
      >
        <template #prepend>
          <el-button> <i class='iconfont icon-search'/></el-button>
        </template>
      </el-input>
      <!-- 操作按钮 -->
      <div>
        <el-button type="primary" @click="addImage">新增图片</el-button>
        <el-popconfirm 
            title="确定要删除选中的图片吗？"
            width="300"
            @confirm="handleDeleteSelectedIds"
          >
            <template #reference>
              <el-button type="danger">批量删除</el-button>
            </template>
        </el-popconfirm>
      </div>
    </div>
    <el-table 
      :data="picturesNeedToShow"
      ref="table"
      style="width: 100%"
      :height="600"
    >
      <el-table-column type="selection" width="65" />
      <el-table-column prop="name" label="名称" width="300" />
      <el-table-column
        prop="type"
        label="图片分类"
        width="300"
        :filters="filterType"
        :filter-method="handleFilter"
      >
        <template #default="scope">
          {{ typeLabels[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="src" label="图片预览" width="300" >
        <template #default="scope">
          <el-image :src="scope.row.src" class="image-preview"/>
        </template>
      </el-table-column>
      <el-table-column prop="modified" label="修改时间" width="300" >
        <template #default="scope">
          {{ getDate(scope.row.modified) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button 
            size="small"
            type="primary"
            @click="handleEdit(scope.row, scope)"
          >
            编辑
          </el-button>
          <el-popconfirm 
            title="确定要删除该图片吗？"
            width="300"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm> 
        </template>
    </el-table-column>
    </el-table>
    <upload-image-dialog 
      ref="dialog"
      :is-visible="isVisible"
      :is-editing="isEditing"
      :cascader-options="cascaderOptions"
      @success-upload="successUpload"
      @cancel="handleCancel"
      @update-cascader-options="handleUpdateCascaderOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElTable, ElTableColumn, ElImage, ElButton, ElPopconfirm, ElInput } from 'element-plus';

import UploadImageDialog from 'lowcode-platform/components/upload-image-dialog/index.vue';
import { deleteImage, deleteImageByIds, getImages } from 'lowcode-platform/api/image';
import { StatusCode } from 'lowcode-platform/api/type';
import type { Image } from 'lowcode-platform/api/image';
import { getDate } from 'lowcode-platform/utils/time';
import { showErrorMessage, showSuccessMessage } from 'lowcode-platform/utils/toast';
import { useCascaderType } from 'lowcode-platform/hooks/use-cascader-type-hook';
import { useElTableHooks } from 'lowcode-platform/hooks/use-el-table-hook';
import { Type } from 'lowcode-platform/store/type-store';

// 图片数据
const pictures = ref<Image[]>([]);
// 上传对话框实例
const dialog = ref<null | InstanceType<typeof UploadImageDialog>>(null);
// 对话框是否可见
const isVisible = ref(false);
// 是否处于编辑数据状态
const isEditing = ref(false);
// 正在编辑状态的下标
let isEditingIndex = -1;

// 使用 el-table 的 hook
const {
  // 表格实例
  table,
  // 搜索关键字
  search,
  // 处理过滤
  handleFilter,
} = useElTableHooks<Image>();

// 需要展示的图片数据
const picturesNeedToShow = computed(() => {
  if(!search.value) {
    return pictures.value;
  }

  return pictures.value.filter((picture) => picture.name.includes(search.value));
});

// 类型级联选择框 hook
const {
  // 级联选择框选项
  cascaderOptions,
  // 类型标签
  typeLabels,
  // 获取级联选择框相关数据
  getCascaderOptions
} = useCascaderType(Type.Image);

getCascaderOptions();

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

// 获取图片
const getPicture = async () => {
  const { data } = await getImages();
  if (!data || data.code !== StatusCode.Success || !data.images) throw new Error(data.msg);
  pictures.value = data.images;
};
getPicture();

// 删除图片
const handleDelete = async (image: Image) => {
  const { data } = await deleteImage(image._id);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  await getPicture();
};

// 批量删除图片
const handleDeleteSelectedIds = async () => {
  const selectedRows = table.value?.getSelectionRows() as Image[];
  if(!selectedRows || !selectedRows.length) {
    showErrorMessage('未选中需要批量删除的图片');
    return;
  }

  const ids = selectedRows.map((image) => image._id);
  const { data } = await deleteImageByIds(ids);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  getPicture();
};

// 处理编辑图片
const handleEdit = (image: Image, scope: any) => {
  dialog.value?.setUploadForm({
    id: image._id,
    name: image.name,
    src: image.src,
    type: image.type,
  });
  isEditingIndex = scope.$index;
  isEditing.value = true;
  isVisible.value = true;
}

// 取消或关闭上传图片框
const handleCancel = () => {
  isVisible.value = false
  isEditing.value = false;
  isEditingIndex = -1;
}

// 添加图片
const addImage = () => {
  isEditing.value = false;
  isVisible.value = true;
}

// 成功处理上传
const successUpload = () => {
  isVisible.value = false;
  getPicture();
}

// 处理更新级联选择框
const handleUpdateCascaderOptions = async () => {
 await getCascaderOptions();
 await getPicture();
 if(isEditingIndex === -1) return;
 // 重新设置图片并更新表单
 const image = picturesNeedToShow.value[isEditingIndex];
 dialog.value?.setUploadForm({
    id: image._id,
    name: image.name,
    src: image.src,
    type: image.type,
  });
};
</script>

<style scoped src="./index.scss"></style>