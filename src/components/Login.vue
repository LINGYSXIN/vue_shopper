<template>
<div class="login_container">
  <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
<!--    表单区域-->
    <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
<!--      用户名-->
      <el-form-item  prop="username">
        <el-input v-model="loginForm.username"  placeholder="用户名" >
<!--          使用  :prefixIcon= 的方式没有办法添加图标（不显示），使用插槽的方式可以-->
          <template #prefix>
            <el-icon class="el-input__icon"><avatar /></el-icon>
          </template>
        </el-input>

      </el-form-item>
<!--      密码-->
      <el-form-item  prop="password" >
        <el-input type="password" v-model="loginForm.password"  placeholder="密码" >
          <template #prefix>
            <el-icon class="el-input__icon"><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
<!--      按钮区域-->
      <el-form-item class="btn">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetForm" >重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</div>
</template>

<script>
// import {Avatar,Lock} from '@element-plus/icons-vue' //element-plus 导入问题导致的图标不能显示
import router from "@/router";
export default {
  name: 'Login',
  setup(){
    return {
      // Avatar,
      // Lock,
      //表单验证对象
      loginFormRules:{
        username:[
          { required: true, message: '请输入正确用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '用户名称应为3-5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码应为8-16位', trigger: 'blur' }
        ]
      }
    }
  },
  data(){
    return{
      //数据表单绑定对象
      loginForm:{
        username:'admin',
        password:'123456'
      }
    }
  },
methods:{
    resetForm(){
      this.$refs.loginFormRef.resetFields();//注意要带s
    },
    login(){
      this.$refs.loginFormRef.validate(async validate=>{
        console.log(validate);
        //预先验证登录信息
        if(!validate) return;
        //发起接口请求
        const {data:res}=await this.$http.post('/login',this.loginForm);
        //弹窗提示登录结果
        if (res.meta.status !== 200) return this.$message.error('登录失败！');
        this.$message.success('登录成功！');
      //  进行token保存
        console.log(res)
        sessionStorage.setItem('token',res.data.token);
        await router.push('/home');
      })
    }
}

}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px ;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50% ;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width:100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  color:black;
}
.btn{
  display: flex;
  justify-content: right;
  //right: 0;
}
</style>
