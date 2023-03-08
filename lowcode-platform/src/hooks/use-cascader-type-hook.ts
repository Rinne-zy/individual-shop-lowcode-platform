
import { CascaderOption } from "element-plus";
import { computed, ref } from "vue";

import { useTypeStore } from './../store/type-store';
import type {  Type } from './../store/type-store';
import { getCascaderType } from 'lowcode-platform/api/type/index';
import { StatusCode } from "lowcode-platform/api/type";

// 获取类型级联选择框
export function useCascaderType(type: Type) {

  const typeStore = useTypeStore();
  const cascaderOptions = computed(() => typeStore.options[type]);
  const typeLabels = computed(() => typeStore.labels[type]);

  // 获取级联选项
  const getCascaderOptions = async () => {
    const { data } = await getCascaderType(type);
    if (!data || data.code !== StatusCode.Success || !data.options) throw new Error(data.msg);

    typeStore.updatedLabels(type, data.labels);
    typeStore.updatedOptions(type, data.id, data.options);
  };

  return {
    cascaderOptions,
    typeLabels,
    getCascaderOptions
  }
}