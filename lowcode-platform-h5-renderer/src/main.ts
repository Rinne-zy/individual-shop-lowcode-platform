import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import './assets/css/resize.css'
import 'vant/lib/index.css';

const pinia = createPinia();

createApp(App).use(pinia).mount('#app');
