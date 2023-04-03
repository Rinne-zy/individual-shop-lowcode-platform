import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from 'pinia';
import uviewPlus from 'uview-plus'
import { usePiniaPersistentStoragePlugin } from "./plugins/pinia-store-presistent-storage-plugins";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();
  pinia.use(usePiniaPersistentStoragePlugin)
  app.use(pinia);
  app.use(uviewPlus)
  return {
    app,
    Pinia,
  };
}
