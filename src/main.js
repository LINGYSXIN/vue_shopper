import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/global.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import {ElMessage, ElMessageBox} from 'element-plus'//全局element-plus message 组件
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css' //解决Can't resolve 'element-plus/dist/index.css' 报错
// import installElementPlus from './plugins/element'

// 配置全局请求基准
//配置token，使用axios请求拦截进行添加token
axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
//  为请求头对象添加token，验证Authorization字段
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
})

const app = createApp(App)
// installElementPlus(app)
app.config.globalProperties.$http=axios
app.config.globalProperties.$message=ElMessage
app.config.globalProperties.$confirm=ElMessageBox.confirm


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(ElementPlus).mount('#app')
