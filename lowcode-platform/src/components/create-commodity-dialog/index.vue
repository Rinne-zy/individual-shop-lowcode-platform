<template>
  <div>
    <el-dialog 
      :model-value="dialogVisible"
      :title="dialogTitle"
      fullscreen
      @closed="handleCancel"
    >
      <el-form
        :model="commodityForm"
        label-position="left"
        ref="formRef"
        :rules="rules"
      >
        <!-- 商品基本信息 -->
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>商品基本信息</span>
            </div>
          </template>
          <el-form-item label="商品名称" prop="name"><el-input v-model="commodityForm.name" /></el-form-item>
          <el-form-item label="商品图片" prop="imagesSrc">
            <draggable-image-list 
              v-model="commodityForm.imagesSrc"
              :max-number="maxImageNumber"
              @handle-add-image="isSelectImageDialogVisible = true"
            /> 
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input
              v-model="commodityForm.desc"
              type="textarea"
              :autosize="{ minRows: 3 }"
            />
          </el-form-item>
          <el-form-item label="商品分类" prop="type">
            <el-cascader 
              :options="cascaderOptions.options"
              placeholder="请选择分类"
              :props="{
                emitPath: false,
              }"
              v-model="commodityForm.type"
              :show-all-levels="false"
            />
            <el-button type="primary" style="margin-left: 10px" @click="handleOpenTypeCreateDialog">添加商品分类</el-button>
          </el-form-item>
        </el-card>
        <!-- 商品交易相关信息 -->
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>商品交易相关信息</span>
            </div>
          </template>
          <el-form-item label="商品价格" prop="price"><el-input v-model="commodityForm.price" type="number" :step="0.01"><template #append>元</template></el-input></el-form-item>
          <el-form-item label="商品折扣(百分比)" prop="discount"><el-slider v-model="commodityForm.discount" style="padding-left: 10px;" :format-tooltip="(number) => `${number}%`"/></el-form-item>
          <el-form-item label="商品库存" prop="stock"><el-input v-model="commodityForm.stock" type="number"><template #append>件/个</template></el-input></el-form-item>
          <el-form-item label="商品运费" prop="freight"><el-input v-model="commodityForm.freight" type="number" :step="0.01"><template #append>元</template></el-input></el-form-item>
        </el-card>
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>商品其他信息</span>
            </div>
          </template>
          <el-form-item label="商品销量"><el-input disabled :model-value="commodityForm.sales" /></el-form-item>
          <el-form-item v-if="commodityForm.addTime" label="创建时间">{{ getDate(commodityForm.addTime) }}</el-form-item>
        </el-card>    
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :disabled="isNotChanged" @click="handleConfirm" >确定</el-button>
        </span>
      </template>
    </el-dialog>
    <select-image-dialog 
      :is-visible="isSelectImageDialogVisible"
      @confirm="handleConfirmSelectImage"
      @close="isSelectImageDialogVisible = false"
    />
    <manage-type-dialog
      ref="manageTypeDialogRef"
      :is-visible="isTypeDialogVisible"
      @close="isTypeDialogVisible = false"
      @add="handleAddCascaderOptions"
      @delete="handleDeleteCascaderOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem, ElDialog, ElButton, ElInput, ElCard, ElCascader, ElSlider } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import type { CascaderOption, FormInstance } from 'element-plus';

import SelectImageDialog from 'lowcode-platform/components/select-image-dialog/index.vue';
import DraggableImageList from 'lowcode-platform/components/draggable-image-list/index.vue';
import ManageTypeDialog from 'lowcode-platform/components/manage-type-dialog/index.vue';
import type { Image } from 'lowcode-platform/api/image';
import { getDate } from 'lowcode-platform/utils/time';
import { deleteCascaderType, updateCascaderType } from 'lowcode-platform/api/type/index';
import { StatusCode } from 'lowcode-platform/api/type';
import { showSuccessMessage } from 'lowcode-platform/utils/toast';
import deepcopy from 'deepcopy';
import { addCommodity, updateCommodity } from 'lowcode-platform/api/commodity';
import type { Commodity, CommodityForm } from 'lowcode-platform/store/commodity-store';
import { compareTwoArrayIsSame } from 'lowcode-platform/utils/array';
import { useCascaderType } from 'lowcode-platform/hooks/use-cascader-type-hook';
import { Type } from 'lowcode-platform/store/type-store';
import { CommodityStatus } from 'lowcode-platform/store/commodity-store';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['cancel', 'confirm', 'updateCascaderOptions']);

defineExpose({
  // 设置表单
  setUploadForm(commodity: Commodity) {
    // 设置原来的 form
    originForm = {
      ...commodity,
      imagesSrc: commodity.imagesSrc.map((images, index) => ({
        id: index,
        src: images,
      })) || []
    };

    Object.assign(commodityForm, deepcopy(originForm));
  }
});

// 商品对话框是否可见
const dialogVisible = computed(() => props.isVisible);
// 是否处于商品编辑状态
const isEditing = computed(() => props.isEditing);
// 对话框标题
const dialogTitle = computed(() => props.isEditing ? '更新商品' : '新增商品');
// 选择图片对话框是否可见
const isSelectImageDialogVisible = ref(false);
// 最大的图片数目
const maxImageNumber = 10;
// 分类管理对话框
const isTypeDialogVisible = ref(false);
// 分类管理对话框实例
const manageTypeDialogRef = ref<InstanceType<typeof ManageTypeDialog> | null>();
// 表单实例 Dom
const formRef = ref<FormInstance>();
// 级联选择选项
const { cascaderOptions, getCascaderOptions } = useCascaderType(Type.Commodity);
// 默认的表单值
const defaultFormValue: CommodityForm = {
  // 商品名称
  name: "",
  // 商品封面
  imagesSrc: [] as { id: number, src: string}[],
  // 商品描述
  desc: "",
  // 商品分类（用于商品分类展示）
  type: "",
  // 商品状态
  status: CommodityStatus.OnStore,
  /* 商品交易信息 */
  // 商品价格
  price: 0,
  // 商品折扣
  discount: 100,
  // 库存
  stock: 0,
  // 运费
  freight: 0,
  // 销量
  sales: 0,
  // 添加时间
  addTime: 0,
};
// 商品表单
const commodityForm = reactive<CommodityForm>(deepcopy(defaultFormValue));
// 当前编辑原表单
let originForm = {} as CommodityForm;
// 是否发生过改变
const isNotChanged = computed(() => {
  return Object.keys(commodityForm).every((key) => {
    const k = key as keyof CommodityForm;
    // 判断两个图片数组是否相同
    if (k === 'imagesSrc') {
      return compareTwoArrayIsSame(originForm[k], commodityForm[k], (value, index) => {
        return commodityForm[k][index].id === value.id
      });
    }

    return originForm[k] === commodityForm[k];
  })
});

// 校验字段是否为空
const notNullValidate = (name: string) => {
  return (rule: any, value: any, callback: any) => {
    if (!value) return callback(new Error(`请输入${name}`));

    callback();
  }
};
// 校验字段不小于 0
const notLessThanZeroValidate = (name: string) => {
  return (rule: any, value: any, callback: any) => {
    if (value < 0) return callback(new Error(`${name}必须大于 0`));

    callback();
  }
};

// 校验规则
const rules = reactive({
  name: [{ validator: notNullValidate('商品名称'), trigger: 'blur' }],
  type: [{ validator: notNullValidate('商品分类'), trigger: 'change' }],
  price: [{validator: notLessThanZeroValidate('商品价格'), trigger: 'blur'}],
  discount: [{validator: notLessThanZeroValidate('折扣'), trigger: 'blur'}],
  stock: [{validator: notLessThanZeroValidate('商品库存'), trigger: 'blur'}],
  freight: [{validator: notLessThanZeroValidate('商品运费'), trigger: 'blur'}],
});

// 校验表单
const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false;
  return await formEl.validate((valid) => valid);
};

// 确认添加商品
const confirmAddCommodity =  async (commodity: Partial<Commodity>) => {
  const { data } = await addCommodity(commodity);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
} 
// 确认更新商品
const confirmUpdateCommodity =  async (id: string, commodity: Partial<Commodity>) => {
  const { data } = await updateCommodity(id, commodity);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
} 

// 处理点击取消按钮
const handleCancel = () => {
  Object.assign(commodityForm, deepcopy(defaultFormValue));
  emits('cancel');
};
// 处理点击确认按钮
const handleConfirm = async () => {
  if(!await validateForm(formRef.value)) return;
  const { imagesSrc } = commodityForm;
  const newCommodity = {
    ...commodityForm,
      imagesSrc: imagesSrc.map((image) => image.src),
  }
  if(isEditing.value) {
    // 编辑情况下商品更新
    await confirmUpdateCommodity( commodityForm._id as string, newCommodity);
  } else {
    // 添加新商品
    await confirmAddCommodity(newCommodity);
  };

  emits('confirm');
};

// 确认选择添加图片
const handleConfirmSelectImage = (images: Image[]) => {
  const length = commodityForm.imagesSrc.length;
  images.forEach((image, index) => {
    const num = index + length;
    // 当超过限制数目，只保留一部分
    if(num >= maxImageNumber) return;
    // 添加图片
    commodityForm.imagesSrc.push({
      id: num,
      src: image.src
    });
  });

  // 关闭图片选择框
  isSelectImageDialogVisible.value = false;
};
// 处理打开分类管理
const handleOpenTypeCreateDialog = () => {
  manageTypeDialogRef.value?.setPropCascaderOption(cascaderOptions.value.options);
  isTypeDialogVisible.value = true;
};

// 删除商品类型
const handleDeleteCascaderOptions = async (options: CascaderOption[], value: string) => {
  const { data } = await deleteCascaderType(cascaderOptions.value.id, options, value, 'commodity');
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  await getCascaderOptions();
  emits('updateCascaderOptions');
};
// 处理添加商品类型
const handleAddCascaderOptions = async (options: CascaderOption[]) => {
  const { data } = await updateCascaderType(cascaderOptions.value.id, options);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  await getCascaderOptions();
  emits('updateCascaderOptions');
};
</script>

<style lang="scss" scoped src="./index.scss"></style>