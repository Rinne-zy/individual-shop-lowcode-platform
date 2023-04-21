<template>
  <div class="tabBar" @click="changeTabItem">
    <div 
      v-for="(tab, index) in tabList"
      :key="tab.value"
      :data-index="index"
      class="tabBar-item"
      :class="{ active: tab.value === activeTab }"
    >
      {{ tab.name }}
    </div>
    <div v-if="tabList.length !== 0" class="active-border" :style="tabBarStyle" />
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue';

// tabBar 项类型
interface tabBarItems {
  name: string;
  value: string
};

const props = defineProps({
  tabList: {
    type: Array as PropType<tabBarItems[]>,
    default: () => [],
  },
  modelValue: {
    type: String || Number,
    default: '',
  }
})
const emits = defineEmits(['update:modelValue']);

// 激活的 tab 项
const activeTab = computed({
  get(){
    return props.modelValue;
  },
  set(newValue: string | number) {
    emits('update:modelValue', newValue);
  }
});
// 激活的 tab 项对应的 index
const activeIndex = ref(props.tabList.findIndex((tabItem) => tabItem.value === props.modelValue));
activeIndex.value = activeIndex.value !== -1 ? activeIndex.value : 0;

// 下划线位置样式
const tabBarStyle = computed(() => ({
  transform: `translateX(calc(375px / ${props.tabList.length} * ${activeIndex.value + 0.5} - 50%))`
}));

// 点击改变 tabBar
const changeTabItem = (e: MouseEvent) => {
  const { index } = (e.target as HTMLElement).dataset;
  if(!index) return;

  activeIndex.value = Number(index);
  activeTab.value = props.tabList[Number(index)].value;
}

</script>

<style lang="scss" scoped src="./index.scss"></style>