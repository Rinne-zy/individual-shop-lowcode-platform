import { defineAsyncComponent } from 'vue';
import { defineStore } from 'pinia';

// 通用样式的 schema 属性
export interface CommonStyleSchema {
  width: number,
  height: number,
  left: number,
  top: number,
  rotate: number,
}

// 组件 schema 属性
export interface ComponentsSchema {
  // 标识组件的唯一 id 值
  id: string;
  // 组件名
  componentName: string;
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

// 编辑器
export interface Editor {
  width: string;
  mode: EditorLayoutMode;
}

export interface Schema {
  // 编辑器样式
  editor: Editor;
  // 组件 schema
  components: ComponentsSchema[];
}

/** 组件 schema */
export enum EditorLayoutMode {
  Sequential = 'sequential',
  Fixed = 'fixed',
}

// schema store 属性
export interface SchemaStore {
  // 商城 id
  _id: string;
  // 商城名称
  name: string;
  // 商城 schema
  schema: Schema,
  // 动态懒加载组件
  components: Map<string, any>,
}

export const useSchemaStore = defineStore('schema', {
  state: (): SchemaStore => ({
    _id: '',
    name: '',
    schema: {
      editor: {
        width: '375px',
        mode: EditorLayoutMode.Fixed,
      },
      components: [] as ComponentsSchema[],
    },
    components: new Map(),
  }),
  actions: {
    getWidthPxNumber() {
      return +this.schema.editor.width.split('px')[0]
    },
    initSchemaStore(id: string, name: string, schema: Schema) {
      this._id = id;
      this.name = name;
      this.schema = schema;
      schema.components.forEach((component) => {
        const { key } = component;
        this.components.set(key, defineAsyncComponent(() => import(`lowcode-platform-h5-renderer/packages/components/${key.toLocaleLowerCase()}/index.vue`)))
      })
    },
     /** 判断是否为固定布局 */
     isFixLayoutMode() {
      return this.schema.editor.mode === EditorLayoutMode.Fixed;
    },
  }
});