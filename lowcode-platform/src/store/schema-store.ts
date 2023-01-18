import { defineStore } from 'pinia';

/** 组件通用 schema */
export interface CommonSchema {
  // 标识组件的唯一 id 值
  id: string;
  // 组件物料的 key
  key: string;
  // 样式
  style: CSSStyleDeclaration;
  // 属性值
  propValue: Record<string, string>
}

/** 组件 schema */
export interface ComponentsSchema extends CommonSchema {

}

/** schema store */
interface SchemaStore {
  schema: {
    components: ComponentsSchema[];
  }
}

// 使用组件物料
export const useComponentsMaterialStore = defineStore('material', {
  state: (): SchemaStore => ({
    schema: {
      components: [],
    },
  }),
  actions: {
    addComponentSchema() {
      
    }
  }
})