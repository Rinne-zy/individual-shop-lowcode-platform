import { defineAsyncComponent } from 'vue';
import type { App } from 'vue';
import 'vant/lib/index.css';

// 注册组件
export function registerComponents(materials: Record<string, { key: string }>) {
 return {
    install (app: App) {
      const componentsMaterials = materials as Record<string, { key: string }>;
      Object.keys(componentsMaterials).forEach((component: string) => {
        const { key } = componentsMaterials[component];
        app.component(key, defineAsyncComponent(() => import(`./components/${component}/index.vue`)));
      })
    }
  }
}
