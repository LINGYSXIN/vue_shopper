<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
      <!--    面包屑导航条目-->
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item >权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图-->
    <el-card>
<!--      添加角色按钮-->
      <el-row >
        <el-col :span="4">
          <el-button type="primary">
            添加角色
          </el-button>
      </el-col>
      </el-row>

<!--角色列表-->
      <el-table
        :data="rolesList"
        style="width: 100%" border stripe
        row-key="id"
        :expand-row-keys="expands"
        @expand-change="expandChange">
<!--        详细展开-->
        <el-table-column type="expand"  >
            <template #default="scope">

<!--                级权限渲染-->
                <el-row
                  v-for="(item1,li1) in scope.row.children"
                  :key="item1.id"
                  :class="['bdbottom',li1 === 0 ? 'bdtop': ' ','vcenter']"
                >
<!--                  一级权限渲染-->
                  <el-col :span="5">
                    <el-tag
                      @close="removeRightById(scope.row,item1.id)"
                      closable >
                    {{ item1.authName }}
                    </el-tag>
                    <el-icon><CaretRight /></el-icon>
                  </el-col>

<!--                  二级权限渲染和三级权限-->
                  <el-col :span="19">
                      <el-row
                        v-for="(item2,li2) in item1.children"
                        :key="item2.id"
                        :class="['bdbottom',li2 === 0 ? 'bdtop': ' ','vcenter']"
                      >
<!--                        二级渲染-->
                        <el-col :span="6">
                          <el-tag
                            @close="removeRightById(scope.row,item2.id)"
                            type="success"
                            closable >
                            {{ item2.authName }}
                          </el-tag>
                          <el-icon><CaretRight /></el-icon>
                        </el-col>

<!--                        三级目录渲染-->
                        <el-col :span="18">
                              <el-tag
                                @close="removeRightById(scope.row,item3.id)"
                                v-for="item3 in item2.children"
                                :key="item3.id"
                                type="warning"
                                closable >
                                {{ item3.authName }}
                              </el-tag>
                        </el-col>

                      </el-row>
                  </el-col>

<!--                  三级权限渲染-->

                </el-row>

            </template>
        </el-table-column >
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column prop="roleDesc" label="角色描述"  />
        <el-table-column  label="角色操作"  >
          <template #default="scope">
          <el-button
            size="mini"
            type="primary" >
            <el-icon><edit/></el-icon>
            编辑
          </el-button>

          <el-button
            size="mini"
            type="danger" >
            <el-icon><edit/></el-icon>
            删除
          </el-button>

          <el-button
            size="mini"
            type="warning"
            @click="showSetRightDialog(scope.row)"
          >
            <el-icon><edit/></el-icon>
            分配权限
          </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
<!--    分配权限的对话框-->
    <el-dialog
      v-model="setRightDialogVisible"
      title="分配权限"
      width="50%"
    >
      <el-tree
        ref="treeRef"
        :data="rightslist"
        show-checkbox
        node-key="id"
        highlight-current
        default-expand-all
        :props="treeProps"
        :default-checked-keys="defkeys"
      />
      <template #footer>
      <span class="dialog-footer">

        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights">
          保存权限
        </el-button>
      </span>
      </template>
    </el-dialog>


  </div>
</template>

<script>
import {ArrowRight} from "@element-plus/icons";
export default {
  name: "Roles",
  components: {ArrowRight},
  data(){
    return{
      rolesList:[],
      expands:[],
      setRightDialogVisible:false,
      //权限列表
      rightslist:[],
      //tree组件的配置文件
      treeProps:{
        label:'authName',
        children:'children'
      },
      //默认保存的节点（权限）
      defkeys:[],
    //  需要改变权限的roleid
      roleId:null,
    }
  },
  created() {
    this.getRolesList()
  },
  methods:{
    async getRolesList(){
      //发送角色列表获取请求
      const {data:res} = await this.$http.get('roles')
      // 检验请求结果
      console.log('获取角色列表响应')
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.$message.success(res.meta.msg)
      this.rolesList = res.data
    },
    //根据Id删除对应权限
    async removeRightById(roles,id){
      console.log(roles)
      console.log('所要删除的权限id为：'+id +'用户为'+roles.id)
      const confirmresult= await  this.$confirm(
        '请再次确认是否删除该权限',
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
          const {data: res} = await this.$http.delete('roles/' + roles.id+'/rights/'+id)
          console.log('请求删除权限的响应')
          console.log(res)
          //验证请求
          if (res.meta.status !== 200) return this.$message.error('请求删除权限失败')
          // 发送message 表示删除成功
          this.$message({
            type: 'success',
            message: res.meta.msg,
          })
          //直接更新全部权限
          roles.children = res.data
          // await this.getRolesList()//会导致页面渲染更新
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除权限',
          })
        })
/*      // 检查异步是否会引起table的重新渲染
    //  并非如此，而是跟新数据后table会自动更新
    // 输出confirm结果

      console.log(confirmresult)
        const {data: res} = await this.$http.delete('roles/' + roles.id+'/rights/'+id)
        console.log('请求删除权限的响应')
        console.log(res)
        //验证请求
        if (res.meta.status !== 200) return this.$message.error('请求删除权限失败')
        // 发送message 表示删除成功
        this.$message({
          type: 'success',
          message: res.meta.msg,
        })
        //直接更新全部权限
        roles.children = res.data*/

    },
    expandChange(row){
      if(this.expands.includes(row.id)){
          this.expands.filter(item=> item != row.id)
      }else{
        this.expands.push(row.id)
      }
    },
    async showSetRightDialog(role){
      this.roleId=role.id
      //获取所有权限的数据
      const {data:res} = await this.$http.get('rights/tree');
      console.log('获取权限树')
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取权限树失败');
      //保存权限数据
      else this.rightslist=res.data

      //获取三级节点
      this.defkeys=[];//清理之前所有的数据
      this.getLeafKeys(role,this.defkeys)

      this.setRightDialogVisible=true;
    },
    //通过递归形式获取三级节点的id保存到defkeys中
    getLeafKeys(node,arr){
    //  如果当前node节点不包含children属性，就为三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      //采用遍历数组并开始递归
      node.children.forEach( item=>{
        this.getLeafKeys(item,arr)
      })
    },
    async allotRights(){
        //获取半选和全选的选项ID
        const keys=[ ...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys)
      // 格式化
      const idStr=keys.join(',')
      console.log(idStr)
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200) return this.$message.error('保存权限失败')
      this.$message.success(res.meta.msg)
      //跟新权限列表
      this.getRolesList()

      this.setRightDialogVisible =false
    }

  }
}
</script>

<style scoped>
/*tag标签的边距*/
.el-tag{
  margin: 7px;
}
/*各层级权限的分隔线*/
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
