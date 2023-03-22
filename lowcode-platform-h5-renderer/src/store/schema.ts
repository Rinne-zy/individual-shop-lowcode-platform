import { defineAsyncComponent } from 'vue';
import { defineStore } from 'pinia';

import type { Schema, ComponentsSchema } from 'lowcode-platform-h5-renderer/type/schema';
import { EditorLayoutMode } from 'lowcode-platform-h5-renderer/type/schema';
import { TabbarItem } from 'lowcode-platform-h5-renderer/type/index';
import { getSchemaById } from 'lowcode-platform-h5-renderer/api/schema';

// 动态懒加载组件
const components = new Map<string, any>();

// schema store 属性
export interface ShopStore {
  // 商城 id
  _id: string;
  // 商城名称
  name: string;
  // 商城 schema
  schema: Schema,
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
        components.set(key, defineAsyncComponent(() => import(`lowcode-platform-h5-renderer/packages/components/${key.toLocaleLowerCase()}/index.vue`)))
      })
    },
     /** 判断是否为固定布局 */
     isFixLayoutMode() {
      return this.schema.editor.mode === EditorLayoutMode.Fixed;
    },
    /** 获取商城组件并注册 */
    async getComponents() {
      const { schema } = await getSchemaById(this._id);
      if(!schema) return;
      this.schema = schema;
      schema.components.forEach((component) => {
        const { key } = component;
        if(components.has(key)) return;
        components.set(key, defineAsyncComponent(() => import(`lowcode-platform-h5-renderer/packages/components/${key.toLocaleLowerCase()}/index.vue`)))
      })
    },
    /** 根据 key 获取相应的组件 */
    getComponentByKey(key:string) {
      return components.get(key);
    }
  }
});