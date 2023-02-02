import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

import { CommonStyleSchema } from 'lowcode-platform/packages/types/index';
import { useEditorStatusStore } from './editor-status-store';
import { showErrorMessage } from 'lowcode-platform/utils/toast';
import { swap } from 'lowcode-platform/utils/array';

/** 组件通用 schema */
export interface CommonSchema {
  // 标识组件的唯一 id 值
  id: string;
  // 组件物料的 key
  key: string;
  // 是否等比例放缩
  isProportion: boolean,
  // 是否正在编辑属性面板
  isEdited: boolean,
  // 通用样式
  style: CommonStyleSchema;
  // 组件样式
  componentStyle: CSSStyleDeclaration,
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
  }),
  actions: {
    /**
     * 添加组件 schema
     * @param schema 组件 schema
     */
    addComponentSchema(schema: Partial<CommonSchema>) {
      const { components } = this.schema;
      components.push({
        ...schema,
        // 生成唯一标识
        id: uuidv4(),
      } as CommonSchema);
    },
    /**
     * 更新组件样式
     * @param id 组件 id
     * @param newStyle 新样式
     * @returns 
     */
    updatedComponentSchemaStyleById(id: string, newStyle: Partial<CommonStyleSchema>) {
      const { components } = this.schema;
      const schema = components.find(component => component.id === id);
      if(!schema) return;

      // 更新样式
      const { style } = schema;
      schema.style = {
        ...style,
        ...newStyle
      }
    },
    /**
     * 根据组件的 index 删除组件
     * @param index 组件在 Components Schema 数组中的顺序
     */
    deleteComponentSchemaByIndex(index: number) {
      if(index === -1 ) return;
      const { components } = this.schema;
      components.splice(index, 1);
    },
    /** 获取选中的组件的 schema */
    getSelectedComponentSchema() {
      const { components } = this.schema;
      const editorStatusStore = useEditorStatusStore();
      return components.find(component => component.id === editorStatusStore.selectedComponentSchemaId);
    },
    /** 上移组件层级 */
    upComponent() {
      const editorStatusStore = useEditorStatusStore();
      const selectedIndex = editorStatusStore.selectedComponentIndex;
      const { components } = this.schema;
      // 上移图层 index，表示元素在数组中越往后
      if (selectedIndex >= components.length - 1) {
        showErrorMessage('已经到顶了');
        return;
      };
      
      swap(components, selectedIndex, selectedIndex + 1);
      editorStatusStore.selectedComponentIndex = selectedIndex + 1;
    },
    /** 下移组件层级 */
    downComponent() {
      const editorStatusStore = useEditorStatusStore();
      const selectedIndex = editorStatusStore.selectedComponentIndex;
      const { components } = this.schema;
        // 下移图层 index，表示元素在数组中越往前
        if (selectedIndex <= 0) {
        showErrorMessage('已经到底了')
        return;
      };
      
      swap(components, selectedIndex, selectedIndex - 1);
      editorStatusStore.selectedComponentIndex = selectedIndex - 1;
    },
  }
})