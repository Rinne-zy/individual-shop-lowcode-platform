<template>
  <div>
    <el-dialog 
      :model-value="dialogVisible"
      title="图片上传"
      :rules="rules"
      @closed="handleCancel"
    >
      <el-form 
        :model="uploadForm"
        label-position="top"
        ref="formRef"
        :rules="rules"
      >
        <!-- 图片名称 -->
        <el-form-item label="图片名称" prop="name">
          <el-input v-model="uploadForm.name" />
        </el-form-item>
        <!-- 图片 -->
        <el-form-item label="图片选择" prop="src">
          <el-upload
            ref="uploadImage"
            class="image-uploader"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :http-request="isEditing ? handleUpdateImage :handleUploadImage"
            :limit="1"
            :show-file-list="false"
            :auto-upload="false"
          >
            <template #trigger>
              <img v-if="imageSrc" :src="imageSrc" class="image"/>
              <div v-else class="image-uploader-icon">+</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm" :disabled="isNotChanged">{{ isEditing ? '更新' : '上传' }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem, ElUpload, ElDialog, ElButton, ElInput } from 'element-plus';
import type { FormInstance, UploadRequestOptions } from 'element-plus';
import { reactive, computed, ref, watch, onUnmounted } from 'vue';

import { useImageUpload } from 'lowcode-platform/hooks/use-image-upload-hook';
import { updateImage, uploadImage as upload } from 'lowcode-platform/api/image/index';
import { StatusCode } from 'lowcode-platform/api/type';
import { showSuccessMessage, showErrorMessage } from 'lowcode-platform/utils/toast';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  }
})

const emits = defineEmits(['cancel', 'successUpload']);

defineExpose({
  // 编辑图片上传表单
  setUploadForm(formData: typeof uploadForm) {
    uploadForm.name = formData.name;
    uploadForm.id = formData.id;
    imageSrc.value = formData.src;
    originFormData = formData;
  }
});

// 是否处于编辑状态
const isEditing = computed(() => props.isEditing);
// 点击编辑时的表单
let originFormData = {} as typeof uploadForm;
// 判断编辑状态是否已改变控制是否可上传
const isNotChanged = computed(() => isEditing && originFormData.name === uploadForm.name && originFormData.src === uploadForm.src);

// 图片上传对话框
const dialogVisible = computed(() => props.isVisible);
// 表单实例
const formRef = ref<FormInstance>();
// 图片上传表单
const uploadForm = reactive({
  id: '',
  name: '',
  src: '',
});

// 图片上传钩子
const {
  uploadImage,
  imageSrc,
  handleChange,
  handleExceed,
} = useImageUpload();

// 监听图片 src 变化同步更新表单
const stopWatchSrc = watch(
  () => imageSrc.value,
  (value) => {
    uploadForm.src = value;
    if(value) {
      // 重新检验表单
      formRef.value?.validateField('src');
    }
  }
);

// 校验图片名称
const validateName = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error('请输入图片名称'));

  callback();
}
// 校验图片 src
const validateSrc = (rule: any, value: any, callback: any) => {
  if(!imageSrc.value) return callback(new Error('请选择图片'));

  uploadForm.src = imageSrc.value;
  callback();
};
// 校验规则
const rules = reactive({
  name: [{ validator: validateName, trigger: 'blur' }],
  src: [{ validator: validateSrc, trigger: 'change' }],
});

// 取消上传
const handleCancel = () => {
  emits('cancel');
  resetForm();
};
// 点击确认上传
const handleConfirm = async () => {
  if(!await validateForm(formRef.value)) return;
  if(originFormData.src === uploadForm.src) {
    handleUpdate();
  }
  uploadImage.value?.submit();
};

// 校验表单
const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false;
  return await formEl.validate((valid) => valid);
};
// 重置图片上传表单
const resetForm = () => {
  uploadForm.name = '';
  uploadForm.src = '';
  imageSrc.value = '';
  originFormData = {} as typeof uploadForm;
  // 清除校验
  formRef.value?.clearValidate();
};

// 处理上传新图片
const handleUploadImage = async (options: UploadRequestOptions): Promise<unknown>  => {
  const formData = new FormData();
  formData.append("file", options.file);
  formData.append("name", uploadForm.name);
  try {
    const { data } = await upload(formData);
    if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
    showSuccessMessage('上传成功');
    // 当上传成功触发确认钩子
    emits('successUpload');
    resetForm();
    return true;
  } catch (err) {
    showErrorMessage((err as Error).message);
    return false;
  }
};

// 图片数据发生改变的更新
const handleUpdateImage = async (options: UploadRequestOptions) => {
  const formData = new FormData();
  formData.append("file", options.file);
  formData.append("name", uploadForm.name);
  try {
    const { data } = await updateImage(uploadForm.id, formData);
    if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
    showSuccessMessage('更新成功');
    // 当上传成功触发确认钩子
    emits('successUpload');
    resetForm();
    return true;
  } catch (err) {
    showErrorMessage((err as Error).message);
    return false;
  }
};

// 图片数据未发生改变的更新
const handleUpdate = async () => {
  const formData = new FormData();
  formData.append("name", uploadForm.name); 
  try {
    const { data } = await updateImage(uploadForm.id ,formData);
    if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
    showSuccessMessage('更新成功');
    // 当上传成功触发确认钩子
    emits('successUpload');
    resetForm();
    return true;
  } catch (err) {
    showErrorMessage((err as Error).message);
    return false;
  }
}

onUnmounted(() => {
  stopWatchSrc();
});
</script>

<style scoped src="./index.scss"></style>