<template>
<div>
  <!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
    <!--    面包屑导航条目-->
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item >商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片视图-->
  <el-card>
    <el-row>
<!--      搜索框-->
      <el-col :span="8">
        <el-input
          v-model="queryInfo.query"
          placeholder="请输入需要搜索的商品"
          clearable
          @clear="getGoodsList"
        >
          <template #append>
            <el-button @click="getGoodsList" ><el-icon><search/></el-icon></el-button>
          </template>
        </el-input>
      </el-col>
<!--      添加商品-->
      <el-col :span="4">
        <el-button style="margin:0 10px" type="primary" @click="goAddPage" >
          添加商品
        </el-button>
      </el-col>
    </el-row>

<!--    数据渲染-->
    <el-table
      :data="goodsList"
      border
      stripe
    >
    <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="价格（元）" prop="goods_price" width="95px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="180px">
        <template #default="scope">
          {{ $filters.dateFormat(scope.row.add_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="180px">
        <template #default="scope">
          <el-button  type="primary" @click="goAddPage" size="mini"><el-icon><edit/></el-icon></el-button>
          <el-button  type="danger"  @click="removeById(scope.row.goods_id)" size="mini"><el-icon><delete/></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    分页区域-->
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
      background
    />

  </el-card>

<!--  添加商品对话框-->


</div>
</template>

<script>
export default {
  name: "List",
  data(){
      return{
        //获取商品列表参数
        queryInfo:{
          //查询内容，可为空
          query:'',
          //页面数量
          pagenum: 1,
          //单页条目
          pagesize:5,
        },
        total:0,
        addGoodsDialogVisible:false,
        goodsList:[],


      }
  },
  created() {
    this.getGoodsList()
  },
  methods:{
    // 获取商品数据
    async getGoodsList(){
      const {data:res} = await  this.$http.get('goods',{params:this.queryInfo})
      console.log('商品列表',res)
      if(res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.goodsList = res.data.goods
      this.total=res.data.total
      this.$message.success(res.meta.msg)
    },
    // 分页大小发生改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getGoodsList()
    },
    // 分页大小发生改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getGoodsList()
    },
    //删除商品
    removeById(goods_id){
      console.log(goods_id)
      this.$confirm(
        '该操作将永久删除该商品,是否继续?',
        '警告',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then( async() => {
          const {data:res} = await this.$http.delete(`goods/${goods_id}`);
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('删除成功')
          await this.getGoodsList()
        })
        .catch(()=>this.$message.info('已取消删除'))
    },
    // 添加商品
    goAddPage(){
        this.$router.push('/goods/add')
    }


  }
}
</script>

<style scoped>

</style>
