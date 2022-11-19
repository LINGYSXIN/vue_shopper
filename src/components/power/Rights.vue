<template>
<div>
  <!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
    <!--    面包屑导航条目-->
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item >权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片视图-->
  <el-card>
    <el-table  :data="rightsList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#" ></el-table-column>
      <el-table-column prop="authName" label="权限名称"/>
      <el-table-column prop="path" label="路径"  />
      <el-table-column prop="level" label="权限等级"  >
        <template #default="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag v-if="scope.row.level === '1'" class="ml-2" type="success">二级</el-tag>
          <el-tag v-if="scope.row.level === '2'" class="ml-2" type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

</div>
</template>

<script>
export default {
  name: "Rights",
  data(){
    return{
      rightsList:[]
    }
  },
  created() {
    this.getRightsList()
  },
  methods:{
    async getRightsList(){
      const {data:res}= await this.$http.get('rights/list',)
      if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.$message.success(res.meta.msg)
      this.rightsList = res.data
      console.log(res)
    }
  }
}
</script>

<style scoped>

</style>
