<template>
  <div class="material-item">
    <i class='iconfont material-item-icon' :class="`icon-${icon}`" />
    <div class="material-item-text">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 图标
  icon: {
    type: String,
    default: '',
  },
  // 文本
  label: {
    type: String,
    default: '',
  }
})
</script>

<style src="./index.scss" scoped></style>