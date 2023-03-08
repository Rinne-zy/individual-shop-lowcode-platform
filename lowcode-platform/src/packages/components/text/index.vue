<template>
  <div 
    class="text" 
    :style="[propStyle, textStyle]"
    :class="{nowarp: !propValue.isWarp}"
  >
    {{ propValue.value }}
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import type { TextPropValue } from './type';

const props = defineProps({
  propStyle:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<TextPropValue>,
    default: () => {},
  }
})

// 需要从 propValue 属性值转换为样式的属性名
const needToTransformStyle = ['fontSize', 'color', 'position']

// 文本组件特殊处理样式
const textStyle = computed(() => {
  const style: Record<string, string | number> = {};
  needToTransformStyle.forEach((styleKey) => {
    if(styleKey === 'fontSize') {
      style[styleKey] = `${props.propValue[styleKey]}px`
    } else if (styleKey === 'position') {
      style.textAlign = props.propValue[styleKey];
    } else {
      style[styleKey] = (props.propValue[(styleKey as keyof TextPropValue)] as string);
    }
  })
  return style;
})

</script>

<style src="./index.scss" scoped></style>