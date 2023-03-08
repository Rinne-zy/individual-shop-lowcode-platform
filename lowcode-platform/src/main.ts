import { createApp } from 'vue';
import { createPinia } from 'pinia'
import 'vant/lib/index.css';

import App from './App.vue';
import router from './router';
import { usePiniaPersistentStoragePlugin } from './plugins/pinia-store-presistent-storage-plugins';
import { initAxios } from './hooks/use-axios-init-hook';
import './packages/icons/iconfont.css'
import material from './packages/material.json';
import { registerComponentsAndAttr } from './packages/index';

const pinia = createPinia();
// 初始化 axios
initAxios();

// 使用持久化插件
pinia.use(usePiniaPersistentStoragePlugin)

const app = createApp(App);
app.use(router).use(pinia).use(registerComponentsAndAttr(material));
app.mount('#app');