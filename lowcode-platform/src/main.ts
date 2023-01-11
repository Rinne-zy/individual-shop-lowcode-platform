import { createApp } from 'vue';
import { createPinia } from 'pinia'

import App from './App.vue';
import router from './router';
import { usePiniaPersistentStoragePlugin } from './hooks/use-pinia-store-plugin';
import { initAxios } from './hooks/use-axios-init';

const pinia = createPinia();
// 初始化 axios
initAxios();

// 使用持久化插件
pinia.use(usePiniaPersistentStoragePlugin)

createApp(App).use(router).use(pinia).mount('#app');
