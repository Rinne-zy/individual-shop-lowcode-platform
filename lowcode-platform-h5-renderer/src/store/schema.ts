import { defineAsyncComponent } from 'vue';
import { defineStore } from 'pinia';

import type { Schema, ComponentsSchema } from 'lowcode-platform-h5-renderer/type/schema';
import { EditorLayoutMode } from 'lowcode-platform-h5-renderer/type/schema';
import { TabbarItem } from 'lowcode-platform-h5-renderer/type/index';

// schema store 属性
export interface ShopStore {
  // 商城 id
  _id: string;
  // 商城名称
  name: string;
  // 商城 schema
  schema: Schema,
  // 动态懒加载组件
  components: Map<string, any>,
  // 激活的 tabbar
  activeTabbar: TabbarItem,
}


export const useShopStore = defineStore('shop', {
  state: (): ShopStore => ({
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
    activeTabbar: TabbarItem.Home,
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