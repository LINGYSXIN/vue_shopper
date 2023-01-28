<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
      <!--    面包屑导航条目-->
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->

   <el-card>
<!--     添加分类按钮-->
     <el-row>
       <el-col :span="4">
         <el-button type="primary" @click="showAddDialog" >
           添加分类
         </el-button>
       </el-col>
     </el-row>

<!--表格-->
     <el-table
       :data="cateList"
       style="width: 100%"
       row-key="cat_id"
       :tree-props="{ children: 'children', hasChildren: 'haschildren' }"
       border
       stripe>
       <el-table-column type="index" label="#" />
       <el-table-column prop="cat_name" label="分类名称" sortable/>


       <el-table-column prop="cat_deleted" label="是否有效" sortable >

       <template v-slot="scope">
         <el-tag v-if="scope.row.cat_deleted === false" type="success" round>
           <el-icon ><SuccessFilled /></el-icon>
         </el-tag>

         <el-tag v-else  type="danger" round>
           <el-icon ><CircleCloseFilled /></el-icon>
         </el-tag>

       </template>
       </el-table-column>

       <el-table-column prop="cat_level" label="排序"  >
         <template v-slot="scope">
           <el-tag v-if="scope.row.cat_level === 0"  round>
             一级
           </el-tag>
           <el-tag  v-if="scope.row.cat_level === 1" type="success" round>
             二级
           </el-tag>
           <el-tag  v-if="scope.row.cat_level === 2" type="warning" round>
             三级
           </el-tag>

         </template>
       </el-table-column>
<!--       操作-->
       <el-table-column  label="操作"  >
<!--      使用 element的button-->
<!--         编辑按钮-->
           <el-button type="primary"  > <el-icon> <edit></edit></el-icon>编辑</el-button>
<!--         删除按钮-->
          <el-button type="danger" ><el-icon> <delete></delete></el-icon>删除</el-button>
       </el-table-column>
     </el-table>



<!--     分页-->
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

<!--    添加分类对话框-->
    <el-dialog
      v-model="addDialogVisible"
      title="添加分类"
      width="50%"
    >
<!--      添加分类的表单-->
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               label-width="50%"
               ref="addCateFormRef"

      >
        <el-form-item label="分类名称" prop="cat_name" >
          <el-input v-model="addCateForm.cat_name" />
        </el-form-item>
        <el-form-item label="父级分类">
<!--          options 指定数据源-->
<!--          props 指定级联选择器配置-->
          <el-cascader
            v-model="selectedKey"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            placeholder="请选择父级分类"
          />
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogClose">取消</el-button>
        <el-button type="primary" @click="addCate">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "Cate",
  data(){
    return{
      //添加分类对话框可视布尔值
      addDialogVisible:false,
      //查询参数
      queryInfo:{
        // 查询类型
        type:3,
        //页面数量
        pagenum: 1,
        //单页条目
        pagesize:5,
      },
      total:1,
      //商品分类列表
      cateList:[],
    //  添加分类
      addCateForm:{
        // 新分类名称
        cat_name:"",
        //父级id
        cat_pid:0,
      //分类层级
        cat_level:0,



      },
      //添加分类表单的验证规则
      addCateFormRules:{
        cat_name:[
          {
            required:true,message:'请输入分类名称',trigger:'blur'
          }
        ]
      },
      //  父级分类数据
      parentCateList:[],
    //  指定级联选择器的配置要求
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      //选中的父级分类 的id 数组
      selectedKey:[],

    }
  },
  created() {
      this.getCateList();
  },
  methods:{
    async getCateList(){
     const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = res.data.result
      this.total=res.data.total
      this.$message.success(res.meta.msg)
    },
    //pagesize改变了
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize;
      this.getCateList();
    },
  //  处理pagenum的改变
    handleCurrentChange(newPageNum){
      this.queryInfo.pagenum=newPageNum;
      this.getCateList();
    },
    showAddDialog(){
      this.addDialogVisible=true;
      this.getParentCateList();
    },
  //获取父级分类的数据
  async  getParentCateList(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}});
      if(res.meta.status !== 200){return this.$message.error('获取父级分类失败')}
      console.log("父级分类数据")
      console.log(res.data);
      this.parentCateList=res.data;
  },
    // 选择发生触发函数
    parentCateChange(){
        console.log(this.selectedKey)
    //  如果seletedKey数组长度大于0说明选中了父级分类，如果大于1，则代表选择了二级父类
      if(this.selectedKey.length > 0){
        // 父级分类的id
         this.addCateForm.cat_pid= this.selectedKey[this.selectedKey.length-1];
         // 父级分类的层级
         this.addCateForm.cat_level=this.selectedKey.length
        return
      }else{
        // 父级分类的id
        this.addCateForm.cat_pid=0
        // 父级分类的层级
        this.addCateForm.cat_level=0
      }
    },
  //  确认添加分类，并向接口提交数据
    addCate(){
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res} =await this.$http.post('categories',this.addCateForm)
        if (res.meta.status !== 201){
          return this.$message.error('添加分类失败！')
        }
      }
    )
      this.$message.success('添加分类成功')
      this.getCateList()
      this.addDialogClose()
    },
    // 关闭添加分类对话框
    addDialogClose(){
      this.addDialogVisible=false
      this.$refs.addCateFormRef.resetFields()
      this.selectedKey=[]
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0

    }
  }
}
</script>

<style scoped>

</style>
