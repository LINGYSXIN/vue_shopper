<template>
  <div>
    homecomponent
    <el-button type="info" @click="logoutHome">退出登录</el-button>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "Home",
  methods:{
    logoutHome(){
      sessionStorage.clear();
      router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>
