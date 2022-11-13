<template>

      <el-container class="home-container">
<!--        头部区域-->
        <el-header>
          <div>
            <img class="logoImg" src="../assets/homelogo.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          <el-button type="info" @click="logoutHome">退出登录</el-button>
        </el-header>
<!--        页面主体区-->
        <el-container>
<!--          侧边栏-->
          <el-aside :width="isCollapse ? '64px' : '200px'">
<!--            侧栏菜单-->
            <div class="toggle-button" @click="toggleCollaps">|||</div>
            <el-menu
              :collapse="isCollapse"
              :collapse-transition="false"
              :router="true"
              active-text-color="#409EFE"
              background-color="#333744"
              class="el-menu-vertical-demo"
              :default-active="activePath"
              text-color="#fff"
            >
<!--              一级菜单-->
              <el-submenu :index="item.path" v-for="item in menulist" :key="item.id">
<!--                以及菜单插槽，模板区域-->
<!--                不要使用 <template slot="title"-->
                <template #title>
<!--                  <el-icon><location /></el-icon>-->
                  <component :is="iconsObj[item.id]" style="height: 14px;width: 14px;margin-right: 10px" ></component>
                  <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="'/'+subItem.path"
                              v-for="subItem in item.children"
                              :key="subItem.id"
                              @click="saveNavState('/'+subItem.path)"
                          >
                  <el-icon style="margin-right: 15px"><icon-menu /></el-icon>
<!--                  <component :is="iconsObj[subItem.id]" style="height: 14px;width: 14px" ></component>-->

                  <span>{{subItem.authName}}</span>


                </el-menu-item>


              </el-submenu>

            </el-menu>
          </el-aside>
<!--          右侧主内容-->
          <el-main>
<!--            路由占位符-->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>

</template>

<script>
import router from "@/router";
import {Menu as IconMenu} from "@element-plus/icons";

export default {
  name: "Home",
  components: {
    IconMenu
  },
  data(){
    return{
      //菜单数据
      menulist:[],
      iconsObj:{
        '125':'Avatar',
        '103':'Box',
        '101':'Goods',
        '102':'List',
        '145':'DataLine'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created() {
    this.getMenuList()
    this.activePath=sessionStorage.getItem('activePath')
  },
  methods:{
    logoutHome(){
      sessionStorage.clear();
      router.push('/login');
    },
    // 获取所有菜单
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      console.log(res);
      // 验证获取成功状态
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist=res.data;
      // 将菜单数据注入data
    },
    //点击收起菜单
    toggleCollaps(){
        this.isCollapse=!this.isCollapse;
    },
    //储存高亮菜单栏,保存链接激活状态
    saveNavState(activePath){
      sessionStorage.setItem('activePath',activePath);
      this.activePath=activePath;
    }
  }
}
</script>

<style scoped>
.home-container{
  height: 100%;
}
.logoImg{
  height: 100%;
}
.el-header{
  background-color: #273d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #ffffff;
  font-size: 20px;
}
.el-header div{
  display: flex;
  align-items: center;
}
.el-header span{
  margin-left: 15px;
}
.el-aside{
  background-color:#333744;
}
.el-main{
  background-color: #eaedf1;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px ;
  line-height: 24px;
  color:#ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
