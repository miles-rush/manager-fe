import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import request from './util/request'
import storage from './util/storage'
import api from './api';
import store from './store'


console.log('环境变量=>',import.meta.env)
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

app.use(store).use(ElementPlus).use(router).mount('#app')
