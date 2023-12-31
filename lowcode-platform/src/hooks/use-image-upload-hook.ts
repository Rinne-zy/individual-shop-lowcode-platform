import { genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { ref } from "vue";

/** 图片上传 */
export function useImageUpload() {
  // 上传图片 Dom
  const uploadImage = ref<UploadInstance>();
  const imageSrc = ref('');

  // 处理图片选择改变
  const handleChange: UploadProps['onChange'] = (uploadFile) => {
    imageSrc.value = URL.createObjectURL(uploadFile.raw!);
  }
  // 处理图片超出限制的图片清除
  const handleExceed: UploadProps['onExceed'] = (files) => {
    uploadImage.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadImage.value!.handleStart(file)
  }

  return {
    uploadImage,
    imageSrc,
    handleChange,
    handleExceed,
  }
}