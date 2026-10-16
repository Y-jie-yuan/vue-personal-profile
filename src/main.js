import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

// 实验三：注册 Vue Router（use(router) 之后组件里才能用 RouterView / RouterLink 等）。
// 实验四：注册 Pinia。注意 createPinia() 必须放在 use(router) 之前 ——
// 全局前置守卫内部要调用 useXxxStore()，Pinia 得先装好才能拿到 Store 实例。
createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
