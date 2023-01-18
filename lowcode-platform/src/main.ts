import { createApp } from 'vue';
import { createPinia } from 'pinia'

import { ComponentsWithAttribute } from '@lowcode-platform/packages/src/index';
import App from './App.vue';
import router from './router';
import { usePiniaPersistentStoragePlugin } from './hooks/use-pinia-store-plugin';
import { initAxios } from './hooks/use-axios-init';

import '@lowcode-platform/packages/src/icons/iconfont.css'

const pinia = createPinia();
// 初始化 axios
initAxios();

// 使用持久化插件
pinia.use(usePiniaPersistentStoragePlugin)

const app = createApp(App);
app.use(router).use(pinia).use(ComponentsWithAttribute);
app.mount('#app');