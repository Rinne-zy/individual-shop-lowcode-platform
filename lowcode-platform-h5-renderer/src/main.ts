import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'vant/lib/index.css';

import './assets/css/resize.css'
import router from './router';
import { usePiniaPersistentStoragePlugin } from './plugins/pinia-store-presistent-storage-plugins';

const pinia = createPinia();

// 使用持久化插件
pinia.use(usePiniaPersistentStoragePlugin)

createApp(App).use(router).use(pinia).mount('#app');

