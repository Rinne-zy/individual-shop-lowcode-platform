import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import deepcopy from 'deepcopy';

import { CommonStyleSchema } from 'lowcode-platform/packages/types/index';
import { useEditorStatusStore } from './editor-status-store';
import { showErrorMessage } from 'lowcode-platform/utils/toast';
import { swap } from 'lowcode-platform/utils/array';

/** 组件通用 schema */
export interface CommonSchema {
  // 标识组件的唯一 id 值
  id: string;
  // 组件名
  componentName: string;
  // 组件物料的 key
  key: string;
  // 是否等比例放缩
  isProportion: boolean;
  // 是否为行内元素
  inline: boolean;
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
  // 编辑器样式
  editor: {
    width: string;
    height: string;
    mode: EditorLayoutMode;
  };
  // 组件 schema
  components: ComponentsSchema[];
}

/** 组件 schema */
export enum EditorLayoutMode {
  Sequential = 'sequential',
  Fixed = 'fixed',
}

/** schema store */
interface SchemaStore {
  // 商城 id
  id: string;
  // schema
  schema: Schema,
  // schema 快照
  snapshotSchema: Schema[],
  // schema 快照索引
  snapshotIndex: number,
  // 是否已保存
  isSave: boolean,
}

// 默认 Schema
const defaultSchema =  {
  editor: {
    width: '375px',
    height: '667px',
    mode: EditorLayoutMode.Fixed,
  },
  components: [] as ComponentsSchema[],
};

// 使用组件物料
export const useSchemaStore = defineStore('schema', {
  state: (): SchemaStore => ({
    id: '',
    schema: deepcopy(defaultSchema),
    snapshotSchema: [
      deepcopy(defaultSchema),
    ],
    snapshotIndex: 0,
    isSave: true,
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
    updateComponentSchemaStyleById(id: string, newStyle: Partial<CommonStyleSchema>) {
      const { components } = this.schema;
      const schema = components.find(component => component.id === id);
      if(!schema) return;

      // 更新样式
      const { style } = schema;
      schema.style = {
        ...style,
        ...newStyle
      }
      this.isSave = false;
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
    upComponent(index?: number) {
      const editorStatusStore = useEditorStatusStore();
      const selectedIndex = index || editorStatusStore.selectedComponentIndex;
      const { components } = this.schema;
      // 上移图层 index，表示元素在数组中越往后
      if (selectedIndex >= components.length - 1) {
        const errMsg = this.isFixLayoutMode() ? '已经浮到顶层了' : '已经在底部了'
        showErrorMessage(errMsg);
        return;
      };
      
      swap(components, selectedIndex, selectedIndex + 1);
      editorStatusStore.selectedComponentIndex = selectedIndex + 1;
    },
    /** 下移组件层级 */
    downComponent(index?: number) {
      const editorStatusStore = useEditorStatusStore();
      const selectedIndex = index || editorStatusStore.selectedComponentIndex;
      const { components } = this.schema;
        // 下移图层 index，表示元素在数组中越往前
      if (selectedIndex <= 0) {
        const errMsg = this.isFixLayoutMode() ? '已经下沉到底了' : '已经在顶部了'
        showErrorMessage(errMsg);
        return;
      };
      
      swap(components, selectedIndex, selectedIndex - 1);
      editorStatusStore.selectedComponentIndex = selectedIndex - 1;
    },
    /** 撤销 */
    undo() {
      if (this.snapshotIndex > 0) {
        this.snapshotIndex -= 1;
        const editorStatusStore = useEditorStatusStore();
        const schema = deepcopy(this.snapshotSchema[this.snapshotIndex]) as Schema;
        editorStatusStore.resetSelectedComponent(schema);
        this.schema = schema;
      } else {
        this.isSave = true;
      }
    },
    /** 重做 */
    redo() {
      if(this.snapshotIndex < this.snapshotSchema.length -1) {
        this.snapshotIndex += 1;
        const editorStatusStore = useEditorStatusStore();
        const schema = deepcopy(this.snapshotSchema[this.snapshotIndex]) as Schema;
        editorStatusStore.resetSelectedComponent(schema);
        this.schema = schema;
      }
    },
    /** 记录快照 */
    recordSnapshot() {
      // 暂时为了节省空间，若 undo 后进行了其他操作会清除后续操作
      if (this.snapshotIndex !== this.snapshotSchema.length - 1) {
        this.snapshotSchema = this.snapshotSchema.slice(0, this.snapshotIndex + 1);
      }
      this.snapshotIndex += 1;
      this.snapshotSchema.push(deepcopy(this.schema));
      this.isSave = false;
    },
    /** 判断是否为固定布局 */
    isFixLayoutMode() {
      return this.schema.editor.mode === EditorLayoutMode.Fixed;
    },
    /** 重置 schema */
    reset(isSaveOperation = false) {
      // 保存操作不需要清除
      if(!isSaveOperation) {
        this.schema = deepcopy(defaultSchema);
        this.snapshotSchema = [
          deepcopy(defaultSchema),
        ];
        this.id = '';
      };

      this.isSave = true;
      this.snapshotIndex = 0;
      const editorStatusStore = useEditorStatusStore();
      editorStatusStore.reset();
    },
    init(schema: Schema, id: string) {
      this.schema = deepcopy(schema);
      this.snapshotSchema = [
        deepcopy(schema),
      ];
      this.id = id;
      this.reset(true);
    },
    isSavedSchema() {
      // 已保存或者快照位于第一个或者只有一个快照（初始化状态）
      return this.isSave || this.snapshotIndex === 0 || this.snapshotSchema.length === 1;
    }
  }
})