<template>
  <div class="operation-menu">
    <el-tooltip
        effect="dark"
        content="撤销"
        placement="top-start"
        :hide-after="50"
      >
        <i 
          class='iconfont material-item-icon operation-menu-icon'
          :class="['icon-undo', undoDisable ? 'icon-disable' : '']"
          @click="undo"
        />
    </el-tooltip>
    <el-tooltip
        effect="dark"
        content="重做"
        placement="top-start"
        :hide-after="50"
      >
        <i 
          class='iconfont material-item-icon operation-menu-icon'
          :class="['icon-redo', redoDisable ? 'icon-disable' : '']"
          @click="redo"
        />  
    </el-tooltip>    
  </div>
</template>

<script setup lang="ts">
import { ElTooltip } from 'element-plus';

import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { computed } from 'vue';

const schemaStore = useSchemaStore();

const undoDisable = computed(() => schemaStore.snapshotIndex <= 0);
const redoDisable = computed(() => schemaStore.snapshotIndex >= schemaStore.snapshotSchema.length -1);

// 重做
const redo = () => {
  if(!redoDisable) return;
  schemaStore.redo();
}

// 撤销
const undo = () => {
  if(!undoDisable) return;
  schemaStore.undo();
}

</script>

<style src="./index.scss" scoped></style>