import { defineStore } from "pinia";

/** 编辑器状态 store */
interface EditorStatusStore {
  // 选中的组件 schema id
  selectedComponentSchemaId: string;
  // 被选中的组件的 index
  selectedComponentIndex: number;
  // 是否展示菜单
  isShowMenu: boolean;
  // 菜单位置
  menuPosition: {
    left?: string,
    top?: string,
  };
}

// 编辑区状态
export const useEditorStatusStore = defineStore('editorStatus', {
  state: (): EditorStatusStore => ({
    selectedComponentSchemaId: '',
    selectedComponentIndex: -1,
    isShowMenu: false,
    menuPosition: {}
  }),
  actions: {
    showMenu(left: string, top: string) {
      this.isShowMenu = true;
      this.menuPosition.left = left;
      this.menuPosition.top = top;
    },
    resetStoreState() {
      this.selectedComponentIndex = -1;
      this.selectedComponentSchemaId = '';
      this.isShowMenu = false;
      this.menuPosition = {};
    }
  }
  
})