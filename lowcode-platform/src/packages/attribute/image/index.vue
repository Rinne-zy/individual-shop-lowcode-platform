<template>
  <div>
    <common-attr />
  </div>
</template>

<script setup lang="ts">
import CommonAttr  from '../common/index.vue';

defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  componentStyle: {
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object,
    default: () => {},
  }
})

</script>

<style scoped>

</style>