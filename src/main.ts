import { createApp } from 'vue'
import './style.css'
import 'vue-toast-notification/dist/theme-default.css';
import App from './App.vue'
import VueToast from 'vue-toast-notification';

createApp(App).use(VueToast).mount('#app')
