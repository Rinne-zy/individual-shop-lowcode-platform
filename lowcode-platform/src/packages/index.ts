import { defineAsyncComponent } from 'vue';
import type { App } from 'vue';

// 注册组件
export function registerComponentsAttr(materials: Record<string, { key: string }>) {
  return {
     install (app: App) {
       const componentsMaterials = materials as Record<string, { key: string }>;
       Object.keys(componentsMaterials).forEach((component: string) => {
         const { key } = componentsMaterials[component];
         app.component(`${key}Attribute`, defineAsyncComponent(() => import(`./attribute/${component}/index.vue`)));
       })
     }
   }
 }
 