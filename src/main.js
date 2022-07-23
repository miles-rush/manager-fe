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

// 自定义组件
import QueryForm from '../packages/QueryForm/index.js'


// console.log('环境变量=>', import.meta.env)

const app = createApp(App);


// 定义一个全局指令->生成的指令式v-has会自动添加前缀v-
app.directive('has', {
    // el - 元素DOM对象
    beforeMount: (el, binging) => {
        // 获取按钮权限
        // console.log(el, binging);
        let userAction = storage.getItem('actionList');
        let value = binging.value;
        // 判断列表中是否有对应按钮权限标识
        let hasPermission = userAction.includes(value);
        if (!hasPermission) {
            el.style = "display:none";
            // beforeMount 此时DOM没有真正渲染 无法直接删除
            // 使用setTimeout将其加入宏任务
            setTimeout(() => {
                el.parentNode.removeChild(el);
            }, 0)
        }
    }
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

app
    .use(store)
    .use(ElementPlus, { size: 'small' })
    .use(router)
    .use(QueryForm)
    .mount('#app')
