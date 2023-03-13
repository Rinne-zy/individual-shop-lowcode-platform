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

// 商城 schema 数据
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