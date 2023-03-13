import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'vant/lib/index.css';

import './assets/css/resize.css'
import router from './router';

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app');

