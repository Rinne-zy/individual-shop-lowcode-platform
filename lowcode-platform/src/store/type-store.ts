import type { CascaderOption } from "element-plus";
import { defineStore } from "pinia";

export enum Type {
  Image = 'image',
  Commodity = 'commodity',
}

interface TypeStore {
  labels: Record<Type, Record<string, string>>,
  options: Record<Type, { id: string, options: CascaderOption[] }>
}

export const useTypeStore = defineStore('type', {
  state:(): TypeStore => ({
    labels: {
      [Type.Image]: {},
      [Type.Commodity]: {},
    },
    options: {
      [Type.Image]: {} as { id: string, options: CascaderOption[] },
      [Type.Commodity]: {} as { id: string, options: CascaderOption[] },
    }
  }),
  actions: {
    updatedLabels(type: Type, label: Record<string, string>) {
      this.labels[type] = label;
    },

    updatedOptions(type: Type, id: string, options: CascaderOption[] ) {
      this.options[type].id = id;
      this.options[type].options = options;
    },
  }
});