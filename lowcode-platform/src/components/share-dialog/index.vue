<template>
  <div>
    <el-dialog v-model="shareDialogVisible" title="二维码分享" width="30%" center @close="closeShareDialog">
      <span>请选择需要分享的二维码类型</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="generateQRCode">普通浏览器二维码</el-button>
          <el-button type="success" @click="generateWxCode">微信小程序二维码</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="codeDialogVisible" title="二维码分享" center @close="closeCodeDialog">
      <div class="code-preview">
        <img :src="codeUrl">
        <div class="code-preview-operation">
          <el-button type="success" @click="downloadCode">点击下载</el-button>
          <el-button  v-show="mode === CodeMode.H5" type="primary" @click="copyUrl">复制H5链接</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElDialog, ElButton } from 'element-plus';
import { ref } from 'vue';
import QRCode from 'qrcode';
import { copy } from 'lowcode-platform-common/utils/copy';
import { showSuccessMessage } from 'lowcode-platform/utils/toast';

enum CodeMode {
  Wx = 'weixin',
  H5 = 'h5'
}

defineExpose({
  show(id: string) {
    shareDialogVisible.value = true;
    shopId.value = id;
  }
});

// 是否可见
const shareDialogVisible = ref(false);
const codeDialogVisible = ref(false);
const mode = ref<CodeMode>(CodeMode.H5)
// 转跳地址
const shopId = ref('');
// 二维码图片
const codeUrl = ref('');
// 生成普通浏览器二维码
const generateQRCode = async () => {
  if(!shopId.value) return;
  try {
    const url = `${import.meta.env.VITE_H5_RENDERER_BASE_URL}/home?id=${shopId.value}`;
    const codeSrc = await QRCode.toDataURL(url);
    codeUrl.value = codeSrc;
    shareDialogVisible.value = false;
    codeDialogVisible.value = true;
    mode.value = CodeMode.H5
  } catch (err: any) {
    throw new Error(err);
  }

}
// 生成微信小程序二维码
const generateWxCode = async () => {
  if(!shopId.value) return;
  try {
    const url = `https://open.weixin.qq.com/sns/getexpappinfo?appid=wxcf5b7717e4ef8d3c&path=pages/shop/index.html?id=${shopId.value}`;
    const codeSrc = await QRCode.toDataURL(url);
    codeUrl.value = codeSrc;
    shareDialogVisible.value = false;
    codeDialogVisible.value = true;
    mode.value = CodeMode.Wx;
  } catch (err: any) {
    throw new Error(err);
  }
}
// 下载二维码
const downloadCode = () => {
  const a = document.createElement('a')
  const event = new MouseEvent('click')
  // 自定义下载后图片的名称
  a.download = '二维码'
  a.href = codeUrl.value
  a.dispatchEvent(event)
}
// 关闭分享对话框
const closeShareDialog = () => {
  shareDialogVisible.value = false;
}
// 关闭二维码窗口
const closeCodeDialog = () => {
  codeDialogVisible.value = false;
  shopId.value = '';
  codeUrl.value = '';
}
// 复制链接 url
const copyUrl = async () => {
  const url = `${import.meta.env.VITE_H5_RENDERER_BASE_URL}/home?id=${shopId.value}`;
  await copy(url);
  showSuccessMessage('复制线上链接成功，快去分享给你的好友吧');
};
</script>

<style lang="scss" scoped src="./index.scss"></style>