<template>
  <div 
    class="text" 
    :style="[propStyle, getTextStyle()]"
    :class="{ nowarp: !propValue.isWarp }"
  >
    {{ propValue.value }}
  </div>
</template>

<script setup lang="ts">
import { transformPxToVw } from 'lowcode-platform-h5-renderer/utils/transform';
import { PropType } from 'vue';
import type { TextPropValue } from './type';

const props = defineProps({
  propStyle:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<TextPropValue>,
    default: () => {},
  },
  viewportWidth: {
    type: Number,
    default: 375,
  }
})

// 需要从 propValue 属性值转换为样式的属性名
const needToTransformStyle = ['fontSize', 'color', 'position'];

const getTextStyle = () => {
  const style: Record<string, string | number> = {};
  needToTransformStyle.forEach((styleKey) => {
    if(styleKey === 'fontSize') {
      style[styleKey] = `${transformPxToVw(props.propValue[styleKey], props.viewportWidth)}`
    } else if (styleKey === 'position') {
      style.textAlign = props.propValue[styleKey];
    } else {
      style[styleKey] = (props.propValue[(styleKey as keyof TextPropValue)] as string);
    }
  });
  return style;
};

</script>

<style src="./index.scss" scoped></style>