<template>
  <div>
    <el-dialog 
      :model-value="dialogVisible"
      title="图片上传"
      :rules="rules"
      :show-close="false"
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
            :http-request="handleUploadImage"
            :limit="1"
            :show-file-list="false"
            :auto-upload="false"
          >
            <template #trigger>
              <img v-if="imageSrc" :src="imageSrc" class="image" />
              <div v-else class="image-uploader-icon">+</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem, ElUpload, ElDialog, ElButton, ElInput } from 'element-plus';
import type { FormInstance, UploadRequestOptions } from 'element-plus';
import { reactive, computed, ref, watch, onUnmounted } from 'vue';

import { useImageUpload } from 'lowcode-platform/hooks/use-image-upload-hooks';
import { uploadImage as upload } from 'lowcode-platform/api/image/index';
import { StatusCode } from 'lowcode-platform/api/type';
import { showSuccessMessage, showErrorMessage } from 'lowcode-platform/utils/toast';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  }
})

const emits = defineEmits(['cancel', 'successUpload'])

// 图片上传对话框
const dialogVisible = computed(() => props.isVisible);

// 图片上传钩子
const {
  uploadImage,
  imageSrc,
  handleChange,
  handleExceed,
} = useImageUpload();

// 表单实例
const formRef = ref<FormInstance>()

// 图片上传表单
const uploadForm = reactive({
  name: "",
  src: "",
});

// 监听图片 src 变化设置表单
const stopWatchSrc = watch(
  () => imageSrc.value,
  (value) => {
    uploadForm.src = value;
    // 重新检验表单
    formRef.value?.validateField('src');
  }
)

// 校验图片名称
const validateName = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入图片名称'))
  }

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
  if(await validateForm(formRef.value)){
    uploadImage.value?.submit();
  };
};

// 校验表单
const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false;
  return await formEl.validate((valid) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  })
};
// 重置表单
const resetForm = () => {
  uploadForm.name = '';
  uploadForm.src = '';
  imageSrc.value = '';
};

// 处理上传图片
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
}

onUnmounted(() => {
  stopWatchSrc();
});
</script>

<style scoped>
.image-uploader .image {
  width: 178px;
  height: 178px;
  display: block;
}

.image-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.image-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}
</style>