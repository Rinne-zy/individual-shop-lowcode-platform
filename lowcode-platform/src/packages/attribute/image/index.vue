<template>
  <div>
    <el-collapse 
      v-model="activeName"
      accordion
    >
      <common-attr />
    </el-collapse> 
  </div>
</template>

<script setup lang="ts">
import { ElCollapse } from 'element-plus';
import { ref } from 'vue';

import CommonAttr  from '../common/index.vue';

defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object,
    default: () => {},
  }
})

// 激活的 tab
const activeName = ref('style');

</script>

<style scoped src="./index.scss"></style>