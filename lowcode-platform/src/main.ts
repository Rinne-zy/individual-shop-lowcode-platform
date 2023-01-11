import { createApp } from 'vue';
import { createPinia } from 'pinia'

import App from './App.vue';
import router from './router';
import { usePiniaPersistentStoragePlugin } from './hooks/use-pinia-store-plugin';
import { initAxiosConfig } from './hooks/use-axios-init';

const pinia = createPinia();
initAxiosConfig();

// 使用持久化插件
pinia.use(usePiniaPersistentStoragePlugin)

createApp(App).use(router).use(pinia).mount('#app');
