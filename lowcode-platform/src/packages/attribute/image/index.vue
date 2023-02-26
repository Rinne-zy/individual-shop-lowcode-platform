<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <!-- 组件属性 -->
      <base-attr :simple-control-options="simpleAttr">
        <!-- 图片地址属性 -->
        <el-form-item label="图片地址">
          <el-select
            style="flex: 67%;"
            v-model="selectedComponent.propValue.src"
            :loading="isLoading"
            placeholder="请选择图片"
            :remote-method="getRemotePictureSrc"
          >
            <el-option
              v-for="item in imagesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button 
            style="flex: 30%; margin-left: 5px;"
            type="primary"
            @click="dialogVisible = true"
          >
            图片上传
          </el-button>
        </el-form-item>
      </base-attr>
    </el-collapse>
    <upload-image-dialog 
      :is-visible="dialogVisible"
      @success-upload="successUpload"
      @cancel="dialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ElCollapse, ElFormItem,ElSelect, ElButton, ElOption } from 'element-plus';
import { computed, ComputedRef, PropType, ref, onMounted } from 'vue';

import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import UploadImageDialog from 'lowcode-platform/components/upload-image-dialog/index.vue';
import { ControlType } from '../base/type';
import type { BaseControlOption } from '../base/type';
import type { ImagePropValue } from '@lowcode-platform/packages/src/components/image/type';
import { useSchemaStore, ComponentsSchema } from 'lowcode-platform/store/schema-store';
import { getImages } from 'lowcode-platform/api/image';
import type { Image } from 'lowcode-platform/api/image';
import { StatusCode } from 'lowcode-platform/api/type';

defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<ImagePropValue>,
    default: () => {},
  }
})

const schemaStore = useSchemaStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema()) as ComputedRef<ComponentsSchema>;

// 激活的 tab
const activeName = ref('style');

// 简单属性（文本输入框、开关）
const simpleAttr: Partial<Record<keyof ImagePropValue, BaseControlOption>> = {
  isRound: {
    type: ControlType.Switch,
    label: "是否为圆角"
  }
};

// 上传图片对话框是否可见
const dialogVisible = ref(false);

const images = ref<Image[]>([]);
const imagesOptions = computed(() => images.value.map((image) => {
  return {
    label: image.name,
    value: image.src,
  }
}))
// 是否正在加载
const isLoading = ref(false);

// 获取远程图片信息
const getRemotePictureSrc = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  const { data } = await getImages();
  if (!data || data.code !== StatusCode.Success || !data.images) throw new Error(data.msg);
  images.value = data.images;
  isLoading.value = false;
};

onMounted(() => {
  // 属性组件 mounted 时获取图片列表
  getRemotePictureSrc();
});

// 成功上传刷新图片列表
const successUpload = () => {
  getRemotePictureSrc();
  dialogVisible.value = false
};
</script>

<style scoped src="./index.scss"></style>