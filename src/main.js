import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'  // 導入 Vuex store
import 'bootstrap/dist/css/bootstrap.css'  // 引入 Bootstrap 的 CSS 文件

createApp(App)
    .use(router)
    .use(store)  // 使用 Vuex store
    .mount('#app')