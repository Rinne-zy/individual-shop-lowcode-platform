<template>
  <div>
    <el-dialog 
      :model-value="dialogVisible"
      :title="dialogTitle"
      fullscreen
      @closed="handleCancel"
    >
      <el-form label-position="left">
        <!-- 商品基本信息 -->
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>商品基本信息</span>
            </div>
          </template>
          <el-form-item label="商品名称"><el-input /></el-form-item>
          <el-form-item label="商品图片">
            <draggable-image-list 
              v-model="testImage"
              :max-number="maxImageNumber"
              @handle-add-image="isSelectImageDialogVisible = true"
            /> 
          </el-form-item>
        </el-card>
        <!-- 商品交易相关信息 -->
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>商品交易相关信息</span>
            </div>
          </template>
        </el-card>
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>商品其他信息</span>
            </div>
          </template>
        </el-card>    
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm" >确定</el-button>
        </span>
      </template>
    </el-dialog>
    <select-image-dialog 
      :is-visible="isSelectImageDialogVisible"
      @confirm="handleConfirmSelectImage"
      @close="isSelectImageDialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem, ElDialog, ElButton, ElInput, ElCard } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

import SelectImageDialog from 'lowcode-platform/components/select-image-dialog/index.vue';
import DraggableImageList from 'lowcode-platform/components/draggable-image-list/index.vue';
import type { Image } from 'lowcode-platform/api/image';

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

const emits = defineEmits(['cancel', 'confirm']);
// 商品对话框是否可见
const dialogVisible = computed(() => props.isVisible);
// 是否处于商品编辑状态
const isEditing = computed(() => props.isEditing);
// 对话框标题
const dialogTitle = computed(() => props.isEditing ? '更新商品' : '新增商品');
// 选择图片对话框是否可见
const isSelectImageDialogVisible = ref(false);

const maxImageNumber = 10;

// 点击取消
const handleCancel = () => {
  emits('cancel');
};

// 确认
const handleConfirm = () => {

}

const testImage = reactive<any[]>([]);

// 确认选择图片
const handleConfirmSelectImage = (images: Image[]) => {
  const length = testImage.length;
  images.forEach((image, index) => {
    const num = index + length;
    // 当超过限制数目，只保留一部分
    if(num >= maxImageNumber) return;
    // 添加图片
    testImage.push({
      id: num,
      src: image.src
    });
  });

  // 关闭图片选择框
  isSelectImageDialogVisible.value = false;
}
</script>

<style lang="scss" scoped src="./index.scss"></style>