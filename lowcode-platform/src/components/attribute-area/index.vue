<template>
  <div class="components-attribute">
    <!-- 滚动  -->
    <div class="components-attribute-content">
      <component 
        :is="`${selectedComponent?.key}Attribute`"
        :style="selectedComponent?.style"
        :propValue="selectedComponent?.propValue"  
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useSchemaStore } from 'lowcode-platform/store/schema-store';

const schemaStore = useSchemaStore();
const selectedComponent = computed(() => schemaStore.getSelectedComponentSchema());


</script>

<style scoped src="./index.scss"></style>