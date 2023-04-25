<template>
  <div class="rich-text">
    <textarea id='rich-text-editor' ref="root" />
    <select-image-dialog 
      :is-visible="isSelectImageDialogVisible"
      :is-single-select="true"
      @confirm="handleConfirmSelectImage"
      @close="isSelectImageDialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import SelectImageDialog from 'lowcode-platform/components/select-image-dialog/index.vue';
import { Image } from 'lowcode-platform/api/image';
import { copy } from 'lowcode-platform-common/utils/copy';
import { showSuccessMessage } from 'lowcode-platform/utils/toast';

const props = defineProps({
  modelValue: {
    type: String,
    require: true,
    default: null,
  },
  config: {
    type: Object,
    default: () => ({})
  },
})

const emits = defineEmits(['update:modelValue', 'blur', 'change']);

const isSelectImageDialogVisible = ref(false);
// 富文本编辑器 DOM
const el = ref<JQuery<HTMLElement> | null>(null);

// 初始化富文本编辑器
const initRichTextEditor = () => {
  if(el.value) return;

  el.value = $('#rich-text-editor');

  el.value.trumbowyg({
    lang: 'zh_cn',
    btnsDef: {
      manageImage: {
        fn: openImageManage,
        ico: 'insertImage',
        title: '本地图片管理'
      }
    },
    btns: [
        ['viewHTML'],
        ['undo', 'redo'], // Only supported in Blink browsers
        ['formatting'],
        ['strong', 'em', 'del'],
        ['superscript', 'subscript'],
        ['link'],
        ['insertImage', 'manageImage'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['unorderedList', 'orderedList'],
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
    ]
  });

  // 绑定值
  el.value.trumbowyg('html', props.modelValue);

  el.value.on('tbwchange', (event) => {
    //@ts-ignore
    emits('update:modelValue', event.target.value);
    emits('change');
  });
  
  el.value.on('tbwblur', (event) => {
    //@ts-ignore
    emits('blur', event.target.value);
  });
}

// 打开图片管理模块
const openImageManage = () => {
  isSelectImageDialogVisible.value = true;
}

// 拷贝图片
const handleConfirmSelectImage = async (image: Image) => {
  await copy(image.src);
  showSuccessMessage('拷贝图片链接成功');
  isSelectImageDialogVisible.value = false;
}

onMounted(() => {
  initRichTextEditor();
})

</script>

<style lang="scss" scoped src="./index.scss"></style>