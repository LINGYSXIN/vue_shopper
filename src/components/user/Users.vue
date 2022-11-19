<template>
<div>
<!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
<!--    面包屑导航条目-->
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item >用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片视图-->

  <el-card>
<!--    使用layout布局 gutter是间距 span是宽度-->
<!--    搜索栏-->
    <el-row :gutter="20">
      <el-col :span="7">    <div class="mt-4">
        <el-input
          v-model="queryInfo.query"
          placeholder="请输入搜索内容"
          clearable
          @clear="getUserList"
        >
          <template #append>
            <el-button @click="getUserList">
              <el-icon><search/></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      </el-col>
<!--      添加用户-->
      <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
<!--    用户列表区-->
    <el-table :data="userList" style="width: 100%" border stripe>
      <el-table-column type="index"  ></el-table-column>
      <el-table-column prop="username" label="姓名" width="180" />
      <el-table-column prop="mobile" label="电话" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="role_name" label="角色" width="180"  />
      <el-table-column prop="mg_state" label="状态" width="180" >
        <template #default="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column  label="操作"  >
        <template #default="scope">
<!--          修改按钮-->
          <el-tooltip
            class="box-item"
            effect="dark"
            content="编辑"
            placement="top"
            :enterable="false"

          >
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(scope.row.id)">
              <el-icon ><edit/></el-icon>
            </el-button>
          </el-tooltip>

          <!--          删除按钮-->
          <el-tooltip
            class="box-item"
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
          <el-button type="danger"   size="mini" @click="deleteUserConfirm(scope.row.id)">
            <el-icon ><delete/></el-icon>
          </el-button>
          </el-tooltip>
          <!--          分配角色按钮-->
            <el-tooltip
              class="box-item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
          <el-button type="warning" size="mini"
            @click="showSetRoleDialog(scope.row)"
          >
            <el-icon ><setting/></el-icon>
          </el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加用户对话框-->
    <el-dialog
      v-model="addDialogVisible"
      title="添加用户"
      width="50%"
      @close="resetAddForm"
    >
      <!--            内容主体区-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!--            脚部按钮-->
      <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="addDialogVisible = false "

        >取消</el-button>

        <el-button
          type="primary"
          @click="addUser"
        >提交</el-button>
      </span>
      </template>
    </el-dialog>

    <!-- 修改用户对话框-->
    <el-dialog
      v-model="editDialogVisible"
      title="添加用户"
      width="50%"
      @close="resetEditForm"
    >
      <!--            内容主体区-->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
        status-icon
      >
        <el-form-item  label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!--            脚部按钮-->
      <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="editDialogVisible = false "
        >取消</el-button>

        <el-button
          type="primary"
          @click="editUserInfo"
        >提交</el-button>
      </span>
      </template>
    </el-dialog>

<!--    分配角色对话框-->
    <el-dialog
      v-model="setRoleDialogVisible"
      title="添加用户"
      width="50%"
      @close="selectedRole=null,userinfo={}"
    >
      <!--            内容主体区-->
      <div>
        <span>当前用户：{{userinfo.username}}</span>
        <br>
        <span>用户角色：{{userinfo.role_name}}</span>
        <p>分配新角色</p>
        <el-select v-model="selectedRole" class="m-2" placeholder="请选择新角色" size="large">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </div>
      <!--            脚部按钮-->
      <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="setRoleDialogVisible=false,selectedRole=null"
        >取消</el-button>

        <el-button
          type="primary"
          @click="saveRoleInfo"
        >提交</el-button>
      </span>
      </template>
    </el-dialog>


    <!--分页区-->
    <el-pagination
      v-model:current-page="queryInfo.pagenum"
      v-model:page-size="queryInfo.pagesize"
      :page-sizes="[1, 2, 3, 4,5]"
      :small="false"
      :disabled="false"
      :background="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</div>
</template>

<script>

export default {
  name: "Users",
  components: {},

  data(){
    //验证邮箱
    let checkEmail = (rule,value,callback)=> {
        const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
        if(regEmail.test(value)){
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
    }
      //验证邮箱
    let checkMobile = (rule,value,callback)=>{
        const regMobile =/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(regMobile.test(value)){
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }

    return{
    //获取用户列表的参数
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0,
    //  添加用户对话框
      addDialogVisible:false,
    //添加用户表单数据
      addForm:{
        username:'',
        password: '',
        email:'',
        mobile:'',
      },
      //添加表单的规则对象
      addFormRules:{
        username:[
          { required: true, message: '请输入正确用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名称应为3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码应为8-16位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '正确手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    //  修改用户对话框
      editDialogVisible:false,
      //修改用户查询到的用户对象
      editForm:{},


    //  分配角色对话框的控制
      setRoleDialogVisible:false,
    //  需要分配角色的用户信息
      userinfo:{},
    //  所有角色列表
      rolesList:[],
    //选择分配的角色
      selectedRole:null,


    }
  },
  created() {
      this.getUserList();
  },
  methods:{
      async getUserList(){
        const {data:res} = await this.$http.get('users',{params:this.queryInfo})
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！');
        this.userList=res.data.users;
        this.total=res.data.total;
      },
    // 监听pagesize 改变的事件
    handleSizeChange(newSize){
        console.log(newSize)
      this.queryInfo.pagesize=newSize
      this.getUserList()
    },
  //  监听页码值改变
    handleCurrentChange(newPage){
        console.log(newPage)
      this.queryInfo.pagenum=newPage
      this.getUserList()
    },
    // 用户状态改变 监听switch开关状态
    async userStateChange(userInfo){
        console.log(userInfo)
      const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`,)
      console.log(res)
      if (res.meta.status !== 200){
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更改状态失败！')
      }
      this.$message.success(res.meta.msg)
    },
  //  重置添加用户的表单
    resetAddForm(){
        this.$refs.addFormRef.resetFields()
    },
  //  添加新用户预验证表单
    addUser(){
        this.$refs.addFormRef.validate(async validate=>{
          //预检验表单
          if(!validate) return this.$message.error('请检查输入内容')
          //提交添加信息
          const {data:res} = await this.$http.post('users',this.addForm)
          //输出提交 结果
          console.log(res)
          //检查提交状态
          if (res.meta.status !== 201) return this.$message.error('添加新用户失败，请检查网络或联系技术人员')
          this.$message.success(res.meta.msg)
        //  隐藏添加用户的对话框
          this.addDialogVisible = false
        //  重新获取用户列表
          await this.getUserList()
        })

    },
    //  弹出编辑对话框
    async  showEditDialog(id){
      console.log('所要编辑的用户id为'+id)
      const {data:res} = await this.$http.get('users/'+id)
      console.log('编辑请求用户id响应')
      console.log(res)
      //检验请求状态
      if (res.meta.status !== 200) return this.$message.error('获取修改用户失败！')
      //保存查询的用户数据
      this.editForm = res.data

      this.editDialogVisible=true

    },
    //  重置添加用户的表单
    resetEditForm(){
      this.$refs.editFormRef.resetFields()
    },
  //  提交修改用户信息
    editUserInfo(){
          this.$refs.editFormRef.validate(async validate=>{
        //预检验表单
        if(!validate) return this.$message.error('请检修改内容')
        //提交添加信息
        const {data:res} = await this.$http.put('users/'+this.editForm.id,
          {
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
        //输出提交 结果
        console.log(res)
        //检查提交状态
        if (res.meta.status !== 200) return this.$message.error('更新新用户失败，请检查网络或联系技术人员')
        this.$message.success(res.meta.msg)
        //  隐藏添加用户的对话框
        this.editDialogVisible = false
        //  重新获取用户列表
        await this.getUserList()
      })

    },
  //  删除用户确认弹窗
    async deleteUserConfirm(id){
     //   confirm 将会返回'confirm'表示用户选择确认，返回'cancel'表示选择了取消，可以通过判定返回的字符串来确认下一步操作
     await this.$confirm(
    '请再次确认是否删除该用户',
    '警告！',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // 用户选择了确认，执行一下
      // 请求删除
      console.log(id)
      const {data: res} = await this.$http.delete('users/' + id)
      console.log('请求删除用户的响应' + res)
      //验证请求
      if (res.meta.status !== 200) return this.$message.error('请求删除用户失败')
      // 发送message 表示删除成功
      this.$message({
        type: 'success',
        message: res.meta.msg,
      })
      //跟新用户列表
      await this.getUserList()
    })
    .catch(() => {
      this.$message({
        type: 'info',
        message: '取消删除用户',
      })
    })
      },
    //设置用户角色对话框
    async showSetRoleDialog(userinfo){
      //  获取需要分配角色的用户信息
      this.userinfo=userinfo;

      //获取所有角色列表
      const {data:res} = await this.$http.get('roles')
      console.log('所有角色列表获取')
      console.log(res)
      if(res.meta.status !== 200)return this.$message.error('获取所有角色列表失败')
      //保存角色列表
      this.rolesList=res.data

      this.setRoleDialogVisible=true;
    },
  //  点击按钮，保存角色
    async  saveRoleInfo(){
    //    判断角色是否被选择
      if (!this.selectedRole){
        this.$message.error('请选择需要分配的新角色')
      }
    //  发送请求，保存用户角色
      const {data:res} = await this.$http.put(`users/${this.userinfo.id}/role`,{rid:this.selectedRole}
      )
      if(res.meta.status !== 200)return this.$message.error('保存用户角色失败')
      this.$message.success(res.meta.msg)
    //  跟新用户列表
      await this.getUserList()
      this.setRoleDialogVisible = false
    }



  },//methods结尾



}
</script>

<style scoped>

</style>
