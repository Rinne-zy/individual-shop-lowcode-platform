import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

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

/** 页面 schema */
export interface Schema {
  editor: {
    width: string;
    height: string;
    mode: EditorLayoutMode;
  }
  components: ComponentsSchema[];
}


/** 组件 schema */
export enum EditorLayoutMode {
  Sequential = 'sequential',
  Fixed = 'fixed',
}

/** schema store */
interface SchemaStore {
  // schema
  schema: Schema,
  // 选中的组件 schema id
  selectedComponentSchemaId: string;
}

// 使用组件物料
export const useSchemaStore = defineStore('schema', {
  state: (): SchemaStore => ({
    schema: {
      editor: {
        width: '375px',
        height: '667px',
        mode: EditorLayoutMode.Fixed,
      },
      components: [],
    },
    selectedComponentSchemaId: '',
  }),
  actions: {
    addComponentSchema(schema: Partial<CommonSchema>) {
      const { components } = this.schema;
      components.push({
        ...schema,
        id: uuidv4(),
      } as CommonSchema);
    },
    getSelectedComponentSchema() {
      const { components } = this.schema;
      return components.find(component => component.id === this.selectedComponentSchemaId);
    },
    /**
     * 更新组件样式
     * @param id 组件 id
     * @param newStyle 新样式
     * @returns 
     */
    updatedComponentSchemaStyleById(id: string, newStyle: CSSStyleDeclaration) {
      const { components } = this.schema;
      const schema = components.find(component => component.id === id);
      if(!schema) return;

      // 更新样式
      const { style } = schema;
      schema.style = {
        ...style,
        ...newStyle
      }
    }
  }
})