import { defineStore } from 'pinia';
import materials from 'lowcode-platform/packages/material.json';

import type { CommonSchema } from './schema-store';

export enum MaterialType {
  Base = 'base',
  ECommerce = 'e-commerce'
}

/** 组件物料类型 */
export interface ComponentMaterial {
  // 物料对应的组件 key
  key: string;
  // 物料展示的标签名
  label: string;
  // 物料展示的图标
  icon: string;
  // 物料类型
  type: MaterialType;
}

/** 组件包 JSON 类型 */
interface Materials extends ComponentMaterial {
  schema: CommonSchema;
}

/** 组件物料 store */
interface ComponentsMaterialStore {
  // 是否已经初始化完毕
  isInit: boolean;
  // 组件物料区列表
  componentsMaterial: Array<ComponentMaterial>;
  // 通过 schema key 获取组件默认 schema
  schemaByMaterialKey: Record<string, CommonSchema>
}

// 使用组件物料
export const useComponentsMaterialStore = defineStore('material', {
  state: (): ComponentsMaterialStore => ({
    // 是否初始化
    isInit: false,
    // 组件物料区列表
    componentsMaterial: [],
    // 组件默认 schema
    schemaByMaterialKey: {},
  }),
  actions: {
    /** 初始化物料组件 store */
    init() {
      if (this.isInit) return;
      const componentsMaterial = materials as unknown as Record<string, Materials>
      Object.keys(componentsMaterial).forEach(component  => {
        const { label, icon, key, schema, type } = componentsMaterial[component];
        // 保存物料
        this.componentsMaterial.push({
          key,
          label,
          icon,
          type,
        });
        // 保存默认 schema
        schema.key = key;
        this.schemaByMaterialKey[key] = schema;
      })
      this.isInit = true;
    }
  }
})
