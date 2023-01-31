<template>
<div>
  <!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
    <!--    面包屑导航条目-->
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item >商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!--卡片视图-->
  <el-card>
<!--    提示框-->
    <el-alert title="注意: 只允许为第三级分类设置相关参数!"
              type="warning"
              :closable="false"
              show-icon/>

<!--    选择商品分类区域-->
    <el-row class="cat_opt">
      <el-col >
        <span>选择商品分类：</span>
<!--        选择商品分类的级联选择框-->
        <el-cascader
          v-model="checkKey"
          :options="cateList"
          :props="cascaderProps"
          @change="handleChange"
          placeholder="请选择"
        />
      </el-col>
    </el-row>
<!-- tab 标签页面-->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
<!--      添加动态参数的面板-->
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          size="mini"
          :disabled="isBtnDisable"
          @click="addDialogVisible=true"
        >添加动态参数</el-button>
        <el-table
        :data="manyTableData"
        border
        stripe
        row-key="attr_id"
        >
<!--          展开行-->
          <el-table-column type="expand">

            <template #default="scope">
<!--            渲染标签-->
              <el-tag
              v-for="(tag,i) in scope.row.attr_vals"
              :key="i"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="removeTag(i,scope.row)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="scope.row.inputVisible"
              ref="addTagInputRef"
              v-model="scope.row.inputValue"
              class="ml-1 w-20 new-tag"
              size="small"
              @keyup.enter="addTagConfirm(scope.row)"
              @blur="addTagConfirm(scope.row)"
            />
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showAddTagInput(scope.row)">
              + New Tag
            </el-button>
            </template>
          </el-table-column>

          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作" >
            <template #default="scope">
              <el-button type="primary" @click="showEditDialog(scope.row.attr_id)"> <el-icon><edit/></el-icon>编辑</el-button>
            <el-button type="danger"  @click="deleteParams(scope.row.attr_id)"><el-icon><delete/></el-icon>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!--      添加静态属性的面板-->
      <el-tab-pane label="静态属性" name="only">
<!--        添加静态属性按钮-->
      <el-button
        type="primary"
        size="mini"
        :disabled="isBtnDisable"
        @click="addDialogVisible=true"
      >添加静态属性</el-button>
<!--        表格数据渲染-->
        <el-table
          :data="onlyTableData"
          border
          stripe
          row-key="attr_id"
        >
          <!--          展开行-->
          <el-table-column type="expand">

            <template #default="scope">
              <!--            渲染标签-->
              <el-tag
                v-for="(tag,i) in scope.row.attr_vals"
                :key="i"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="removeTag(i,scope.row)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="scope.row.inputVisible"
                ref="addTagInputRef"
                v-model="scope.row.inputValue"
                class="ml-1 w-20 new-tag"
                size="small"
                @keyup.enter="addTagConfirm(scope.row)"
                @blur="addTagConfirm(scope.row)"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showAddTagInput(scope.row)">
                + New Tag
              </el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作" >
            <template #default="scope">
              <el-button type="primary" @click="showEditDialog(scope.row.attr_id)"> <el-icon><edit/></el-icon>编辑</el-button>
              <el-button type="danger" @click="deleteParams(scope.row.attr_id)"><el-icon><delete/></el-icon>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-tab-pane>
    </el-tabs>

  </el-card>

<!--  添加属性对话框-->
  <el-dialog
    v-model="addDialogVisible"
    :title="titleText"
    width="50%"
    @close="addDialogClose"
  >
<!--表单-->
    <el-form
      ref="addFormRef"
      :model="addFrom"
      :rules="addFormRules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addFrom.attr_name" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogClose">取消</el-button>
        <el-button type="primary" @click="addParams">
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>

<!--  修改对话框-->

  <el-dialog
    v-model="editDialogVisible"
    title="修改属性或参数"
    width="50%"
    @close="editDialogClose"
  >
    <!--表单-->
    <el-form
      ref="editFormRef"
      :model="editFrom"
      :rules="editFormRules"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="值" prop="attr_name">
        <el-input v-model="editFrom.attr_name" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogClose">取消</el-button>
        <el-button type="primary" @click="editParams">
          修改
        </el-button>
      </span>
    </template>
  </el-dialog>
</div>

</template>

<script>
import {Edit} from "@element-plus/icons";
import {nextTick} from "vue";
export default {
  name: "Params",
  components: {Edit},
  data(){
    return{
      // 商品分类数据
      cateList:[],
      //  指定级联选择器的配置要求
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover',

      },
      //级联选中数据
      checkKey:[],
    //  被激活的页面名称
      activeName:'many',
      // 动态参数数据
      manyTableData:[],
      //静态面板数据
      onlyTableData:[],
    //  控制对话框显示
      addDialogVisible:false,
    //  添加参数的表单数据对象
      addFrom:{
        attr_name:'',
      },
    // 表单验证规则
      addFormRules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      },

    //  编辑对话框
      editDialogVisible:false,
    // 编辑数据表单
      editFrom:{
        attr_name:'',
        attr_id:0
      },
    // 表单验证规则
    editFormRules:{
      attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
    },
    // tag新建输入框显示控制
      inputVisible:false,
    //  新建tag值，
      inputValue:'',




    }

  },
  created() {
    this.getCateList();
  },
  methods:{
     // 获取所有的商品分类
      async getCateList(){
        const {data:res} = await this.$http.get('categories');
        if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
        this.cateList=res.data;
        console.log('商品列表信息');
        console.log('获取商品列表信息，用于选中分类',res.data);
      },
    // 级联选择器选中项变化
    handleChange(){
      this.getParamsData();
    },
    // tab栏被点击
    handleTabClick(){
      this.getParamsData();
    },
    // 获取商品分类参数或属性
    async getParamsData(){
      if (this.checkKey.length !== 3 ){
        this.checkKey = [];
        this.manyTableData=[];
        this.onlyTableData=[];
        return;
      }

      console.log(this.checkKey)

      //  根据所选的id 和当前面板获取对应的参数
      const {data:res} =  await this.$http.get(`categories/${this.cateId}/attributes`,{params :{sel:this.activeName}})
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      res.data.forEach(item=>{
        item.attr_vals=item.attr_vals ? item.attr_vals.split(' ') : []
        //控制文本框的显示与隐藏
        item.inputVisible=false
      //  文本框输入的值
        item.inputValue=''
      })
      console.log('面板数据',res.data)
      if(this.activeName === 'many'){
        this.manyTableData = res.data;
      }else {
        this.onlyTableData =res.data;
      }
    },
    // 添加参数对话框关闭
    addDialogClose(){
        this.addFrom.attr_name='';
        this.addDialogVisible=false

    },
    // 点击按钮添加参数
    addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addFrom.attr_name,
            attr_sel:this.activeName
          })
        console.log('添加参数',res)
          if (res.meta.status !== 201){
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加参数成功')
          await this.getParamsData()
          this.addDialogVisible = false
      }
      )

    },
    // 显示编辑对话框
    async showEditDialog(attr_id){
        this.editDialogVisible=true;
        // 查询当前参数的信息
        const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
        if (res.meta.status !== 200) return this.$message.error('获取当前参数信息失败')
          console.log('查询参数信息',res.data)
          this.editFrom=res.data;
    },
  //  编辑对话框关闭处理
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible=false
    },
    //提交编辑数据
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
            {
            attr_name:this.editFrom.attr_name,
            attr_sel:this.activeName
          })
          console.log('添加参数',res)
          if (res.meta.status !== 200){
            return this.$message.error('修改参数失败！')
          }
          this.$message.success('修改参数成功')
          await this.getParamsData()
          this.editDialogVisible = false
        }
      )
    },
    // 删除参数
    async deleteParams(attr_id){
      this.$confirm(
        '确认删除该项参数码？',
        '警告',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then( async() => {
          const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('删除成功')
          await this.getParamsData()
        })
        .catch(()=>this.$message.info('已取消删除'))
    },
  //  控制添加Tag的输入
    showAddTagInput(row){
      row.inputVisible=true
      // 让文本框自动获取焦点
      //nextick 的作用在与当页面元素重新渲染之后在执行回调函数中的代码
      nextTick(() => {
        this.$refs.addTagInputRef.$refs.input.focus()
      })
    },
  //  添加标签失去焦点或者回车 提交到服务器
    async addTagConfirm(row){
      console.log(row.inputValue)
      if( row.inputValue.trim().length !== 0){
        row.attr_vals.push(row.inputValue.trim())
        await this.saveTag(row)
      }
      row.inputValue=''
      row.inputVisible=false
    },
  //  删除Tag标签
    removeTag(tag,row){
      console.log('要删除的tag',tag)
      row.attr_vals.splice(tag,1)
      this.saveTag(row)
    },
    async saveTag(row){
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:this.activeName,
        attr_vals:row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message('修改参数项失败')
      this.$message.success('修改参数项成功')
    }


  },
  computed:{
    //如果按钮需要被禁用返回true，否则返回false
    isBtnDisable(){
        if (this.checkKey.length !== 3){
          return true
        }
        return false;
    },
    cateId(){
      if(this.checkKey.length ===3 ){
        return this.checkKey[this.checkKey.length-1];
      }
    },
    // 动态计算标题文本
    titleText(){
      if (this.activeName === 'many'){
        return '添加动态参数'
      }else {
        return '添加静态属性'
      }
    }
  }

}
</script>

<style scoped>
.cat_opt{
  margin: 15px 0;
}
.el-tag{
  margin: 10px;
}
.new-tag{
  width: 120px;
}
</style>
