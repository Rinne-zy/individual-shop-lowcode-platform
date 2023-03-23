<template>
  <div>
    <el-dialog 
      :model-value="props.isVisible"
      :title="dialogTitle"
      @closed="handleCancel"
    >
      <el-form 
        :model="form"
        label-position="top"
        ref="formRef"
        :rules="rules"
      >
        <!-- 图片名称 -->
        <el-form-item label="商城名称" prop="name">
          <el-input v-model="form.name" :disabled="props.isEditing" />
        </el-form-item>
        <el-form-item label="商城图片" prop="avatar">
          <div class="image" :class="{ 'image-uploader': !form.avatar}" @click="isSelectImageDialogVisible = true">
            <img v-if="form.avatar" :src="form.avatar" class="image" />
            <div v-else class="image-uploader-icon">+</div>
          </div>
        </el-form-item>
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
      :is-single-select="true"
      @confirm="handleConfirmSelectImage"
      @close="isSelectImageDialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElDialog, ElButton, ElInput } from 'element-plus';
import type { FormInstance } from 'element-plus';

import type { Image } from 'lowcode-platform/api/image';
import SelectImageDialog from 'lowcode-platform/components/select-image-dialog/index.vue';

// 商城表单
interface shopForm {
  name: string,
  avatar: string,
}

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

defineExpose({
  setShopForm(shop: shopForm) {
    form.name = shop.name;
    form.avatar = shop.avatar
  }
})

// 对话框标题
const dialogTitle = computed(() => props.isEditing ? '更新商城 schema' : '创建商城 schema');
const isSelectImageDialogVisible = ref(false);

// 表单实例
const formRef = ref<FormInstance>();
// 创建商城上传表单
const form = reactive<shopForm>({
  name: '',
  avatar: '',
});
const rules = reactive({
  name: [
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (!value) return callback(new Error('请输入图片名称'));
        callback();
      }, 
      trigger: 'blur' 
    }
  ],
  avatar: [
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (!value) return callback(new Error('请选择商城图标'));
        callback();
      }, 
      trigger: 'blur' 
    }
  ]
});
// 校验表单
const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false;
  return await formEl.validate((valid) => valid);
};

// 点击取消
const handleCancel = () => {
  emits('cancel');
  reset();
};
// 重置
const reset = () => {
  form.name = '';
  form.avatar = ''
}
// 点击确认
const handleConfirm = async () => {
  if(!await validateForm(formRef.value)) return;
  emits('confirm', form);
  reset();
};
// 确认
const handleConfirmSelectImage = (image: Image) => {
  form.avatar = image.src;
  isSelectImageDialogVisible.value = false;
  formRef.value?.validateField('avatar')
};

</script>

<style lang="scss" scoped src="./index.scss"></style>