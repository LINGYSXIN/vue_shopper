import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login'
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import Users from "@/components/user/Users";
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";
import Cate from "@/components/goods/Cate";
import Params from "@/components/goods/Params";
import List from "@/components/goods/List";
import Add from "@/components/goods/Add";
import Order from "@/components/order/Order";
import Report from "@/components/report/Report";

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
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:List
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:Order
      },
      {
        path:'/reports',
        component:Report
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
