<template>
  <div>
    <el-dialog 
      :model-value="dialogVisible"
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
          <el-input v-model="form.name" :disabled="isEditing" />
        </el-form-item>
        <!-- TODO: 商城地址显示之类的其余属性 -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm" >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElDialog, ElButton, ElInput } from 'element-plus';
import type { FormInstance } from 'element-plus';

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
  setShopForm(name: string) {
    form.name = name;
  }
})

// 对话框实例
const dialogVisible = computed(() => props.isVisible);
const isEditing = computed(() => props.isEditing);
// 对话框标题
const dialogTitle = computed(() => props.isEditing ? '更新商城 schema' : '创建商城 schema');

// 表单实例
const formRef = ref<FormInstance>();
// 创建商城上传表单
const form = reactive({
  name: '',
});
const rules = reactive({
  name: [
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (!value) return callback(new Error('请输入图片名称'));
        callback();
      }, 
      trigger: 'blur' 
    }],
});
// 校验表单
const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false;
  return await formEl.validate((valid) => valid);
};

// 点击取消
const handleCancel = () => {
  emits('cancel');
};
// 点击确认
const handleConfirm = async () => {
  if(!await validateForm(formRef.value)) return;
  emits('confirm', form.name);
};

</script>

<style lang="scss" scoped src="./index.scss"></style>