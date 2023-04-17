<template>
  <view v-if="isShow" class="toast">
    <view><van-icon name="fail" size="30"/></view>
    <view>{{ msg }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 消息
const msg = ref('');
// 是否展示
const isShow = ref(false);

defineExpose({
  show(message: string) {
    isShow.value = true;
    msg.value = message;
    setTimeout(() => {
      isShow.value = false;
    }, 1500)
  }
})

</script>

<style lang="scss" scoped src="./index.scss"></style>