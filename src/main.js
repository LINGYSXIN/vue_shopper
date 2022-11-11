import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import installElementPlus from './plugins/element'
import '@/assets/css/global.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import axios from 'axios'
import {ElMessage} from 'element-plus'//全局element-plus message 组件

axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'

const app = createApp(App)
// installElementPlus(app)
app.config.globalProperties.$http=axios
app.config.globalProperties.$message=ElMessage


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(ElementPlus, { size: 'small', zIndex: 3000 }).mount('#app')
