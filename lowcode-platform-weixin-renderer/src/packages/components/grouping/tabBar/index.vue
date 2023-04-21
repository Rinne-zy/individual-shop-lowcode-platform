<template>
  <view class="tabBar">
    <view 
      v-for="(tab, index) in tabList"
      :key="tab.value"
      class="tabBar-item"
      :class="{ active: tab.value === activeTab }"
      @click="changeTabItem(index)"
    >
      {{ tab.name }}
    </view>
    <view v-if="tabList.length !== 0" class="active-border" :style="tabBarStyle" />
  </view>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref } from 'vue';

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
  transform: `translateX(calc(100vw / ${props.tabList.length} * ${activeIndex.value + 0.5} - 50%))`
}));

// 点击改变 tabBar
const changeTabItem = (index: number) => {
  activeIndex.value = Number(index);
  activeTab.value = props.tabList[Number(index)].value;
}

</script>

<style lang="scss" scoped src="./index.scss"></style>