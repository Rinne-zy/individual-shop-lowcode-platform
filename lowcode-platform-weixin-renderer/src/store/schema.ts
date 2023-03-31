import { defineStore } from 'pinia';

import type { Schema, ComponentsSchema } from 'lowcode-platform-common/type/schema';
import { EditorLayoutMode } from 'lowcode-platform-common/type/schema';
import { getShopById } from 'lowcode-platform-weixin-renderer/api/shop';

// 动态懒加载组件
const components = new Map<string, any>();

// schema store 属性
export interface ShopStore {
  // 商城 id
  _id: string;
  // 商城名称
  name: string;
  // 商城头像
  avatar: string;
  // 商城 schema
  schema: Schema,
  // 当前商城上架的商品
  commodities: string[]
}

export const useShopStore = defineStore('shop', {
  state: (): ShopStore => ({
    _id: '',
    name: '',
    avatar: '',
    commodities: [],
    schema: {
      editor: {
        width: '375px',
        mode: EditorLayoutMode.Fixed,
      },
      components: [] as ComponentsSchema[],
    },
  }),
  actions: {
    getWidthPxNumber() {
      return +this.schema.editor.width.split('px')[0]
    },
    initSchemaStore(id: string, name: string, avatar: string, schema: Schema, commodities: string[]) {
      this._id = id;
      this.name = name;
      this.avatar = avatar;
      this.commodities = commodities
      this.schema = schema;
    },
     /** 判断是否为固定布局 */
     isFixLayoutMode() {
      return this.schema.editor.mode === EditorLayoutMode.Fixed;
    },
    /** 获取商城组件并注册 */
    async getShop() {
      const { name, avatar, schema, commodities } = await getShopById(this._id);
      if(!schema) return;
      this.initSchemaStore(this._id, name, avatar, schema, commodities);
    },
  }
});