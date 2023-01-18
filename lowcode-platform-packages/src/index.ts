import { defineAsyncComponent } from 'vue';
import type { App } from 'vue';
import 'vant/lib/index.css';

import materials from "./material.json";

// 注册组件及组件属性
export const ComponentsWithAttribute = {
  install (app: App) {
    const componentsMaterials = materials as Record<string, { key: string }>;
    Object.keys(componentsMaterials).forEach((component: string) => {
      const { key } = componentsMaterials[component];
      app.component(key, defineAsyncComponent(() => import(`./components/${component}/index.vue`)));
      app.component(`${key}Attribute`, defineAsyncComponent(() => import(`./attribute/${component}/index.vue`)));
    })
  }
}

// 仅注册组件
export const Components = {
  install (app: App) {
    const componentsMaterials = materials as Record<string, { key: string }>;
    Object.keys(componentsMaterials).forEach((component: string) => {
      const { key } = componentsMaterials[component];
      app.component(key, defineAsyncComponent(() => import(`./components/${component}/index.vue`)));
    })
  }
}