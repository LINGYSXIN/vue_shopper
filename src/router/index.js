import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login'
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import Users from "@/components/user/Users";
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";
import Cate from "@/components/goods/Cate";

const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      } ,
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      }
    ]
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
