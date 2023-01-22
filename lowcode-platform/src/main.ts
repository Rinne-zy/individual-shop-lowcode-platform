import { createApp } from 'vue';
import { createPinia } from 'pinia'

import { registerComponents } from '@lowcode-platform/packages/src/index';
import App from './App.vue';
import router from './router';
import { usePiniaPersistentStoragePlugin } from './hooks/use-pinia-store-plugin';
import { initAxios } from './hooks/use-axios-init';
import './packages/icons/iconfont.css'
import material from './packages/material.json';
import { registerComponentsAttr } from './packages/index';

const pinia = createPinia();
// 初始化 axios
initAxios();

// 使用持久化插件
pinia.use(usePiniaPersistentStoragePlugin)

const app = createApp(App);
app.use(router).use(pinia).use(registerComponents(material)).use(registerComponentsAttr(material));
app.mount('#app');