import { createApp } from 'vue';
import { createPinia } from 'pinia'

import App from './App.vue';
import router from './router';
import { usePiniaPersistentStoragePlugin } from './hooks/use-pinia-store-plugin';

const pinia = createPinia();

// 使用持久化插件
pinia.use(usePiniaPersistentStoragePlugin)

createApp(App).use(router).use(pinia).mount('#app');
