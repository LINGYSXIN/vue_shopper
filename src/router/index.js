import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login'
import Home from "@/components/Home";
const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(
  (to,from,next)=>{
    if(to.path==='/login') return next()   //进行放行
    const tokenStr= sessionStorage.getItem('token')
    if(! tokenStr) return next('/login') //检验token是否存在
    next()
  }
)

export default router
