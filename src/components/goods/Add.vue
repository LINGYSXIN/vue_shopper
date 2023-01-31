<template>
<div>
  <!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
    <!--    面包屑导航条目-->
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item >商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片布局-->
  <el-card>
    <!--    提示区域-->
    <el-alert title="添加商品信息"
              type="info"
              :closable="false"
              show-icon
              center
    />
<!--    步骤-->
    <el-steps  :active="activeIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
<!--    tab栏区域-->
    <el-form
      ref="addGoodsFormRef"
      :model="addGoodsForm"
      :rules="addGoodsFormRules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
      :label-position="'top'"
    >
      <el-tabs
        :tab-position="'left'"
        v-model="activeIndex"
        class="demo-tabs"
        :before-leave="beforeTabLeave"
        @tab-click="tabClicked"

      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsForm.goods_name" />
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodsForm.goods_price" type="number"/>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodsForm.goods_weight" type="number"/>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodsForm.goods_number" type="number" />
          </el-form-item>

          <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="addGoodsForm.goods_cat"
            :options="cateList"
            :props="cascaderProps"
            placeholder="请选择"
            @change="handleChage"
          />
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            :label="item.attr_name"
            v-for="item in manyTableData"
            :key="item.attr_id"
          >
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border />
              </el-checkbox-group>
          </el-form-item>


        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in onlyTableData"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals" />
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
<!--          图片要上传的api地址-->
          <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="uploadHeader"
            :on-success="handleSuccess"
          >
            <el-button type="primary" size="mini">点击上传图片</el-button>

          </el-upload>


        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
<!--          富文本编辑器-->
          <QuillEditor
            style="min-height: 300px !important;"
            toolbar="full"
            theme="snow"
            contentType="html"
            v-model:content="addGoodsForm.goods_introduce"
          />

          <el-button class="btnAdd" type="primary" @click="addGoods">添加商品</el-button>
        </el-tab-pane>

      </el-tabs>
    </el-form>

  </el-card>

<!--  图片预览对话框-->
  <el-dialog
    v-model="previewVisible"
    title="图片预览"
    width="50%"
  >
    <img :src="preViewPath" class="previewImg" >
  </el-dialog>
</div>
</template>

<script>
import _ from 'lodash'
import router from "@/router";
export default {
  name: "Add",
  data(){
    return{
      //当前所处步骤
      activeIndex:'0',
      // 添加商品表单
      addGoodsForm:{
        goods_name:'',
        goods_cat:[],
        goods_price:null,
        goods_weight:null,
        goods_number:null,
        goods_introduce:'',
        pics:[],
        attrs:[]

      },
      // 添加商品表单验证
      addGoodsFormRules:{
        goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
        goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
        goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
        goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
        goods_cat:[{required:true,message:'请输入商品数量',trigger:'blur'}],

      },

      // 商品分类数据
      cateList:[],
      //  指定级联选择器的配置要求
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover',

      },
      // 动态参数数据
      manyTableData:[],
      //静态面板数据
      onlyTableData:[],
      // 上传地址
      uploadURL:`${this.$http.defaults.baseURL}upload`,
      // 图片上传的header
      uploadHeader:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览图片地址
      preViewPath:'',
      // 图片预览对话框
      previewVisible:false,
      // 商品内容编辑器
      editorOption: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }]],

    }
  },
  created() {
    this.getCateList()
  },
  methods:{
    // 获取所有的商品分类
    async getCateList(){
      const {data:res} = await this.$http.get('categories');
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.cateList=res.data;
      console.log('获取商品列表信息，用于选中分类',res.data);
    },
    // 处理切换tab栏
    beforeTabLeave(activeName,oldActiveName){
      console.log(activeName,oldActiveName)
      console.log(this.$refs.addGoodsFormRef.validate( valid=>{if(!valid) return false}))
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3){
        this.$message.error('请选择商品分类')
        return false

      }
    },
    handleChage(){
      if (this.addGoodsForm.goods_cat.length !== 3){
        this.addGoodsForm.goods_cat=[]

      }
    },
    async tabClicked(tab,event){
      console.log(this.activeIndex)
      //访问了动态参数面板
      if (this.activeIndex === '1'){

        console.log('参数面板')
        const {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: { sel:'many'}
        })
        if (res.meta.status !== 200) return this.$message('获取参数失败')

        res.data.forEach(item=> {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
          console.log('动态参数',res.data)
        this.manyTableData = res.data
      }
      if (this.activeIndex === '2'){

        console.log('静态属性')
        const {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: { sel:'only'}
        })
        if (res.meta.status !== 200) return this.$message('获取静态属性失败')

        console.log('静态属性',res.data)
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file){
      this.preViewPath= file.response.data.url
      this.previewVisible =true
    },
    //处理移除图片
    handleRemove(file){
      console.log('要移除的图片',file)
      //获取要删除的图片的临时路径
      const filePath= file.response.data.tmp_path
      // 从数组中找到对应的索引
      const i= this.addGoodsForm.pics.findIndex(x=>
        x.pic === filePath)
      // 从数组中移除
      this.addGoodsForm.pics.splice(i,1)
      console.log('删除后的数组',this.addGoodsForm.pics)
    },
    // 监听图片上传成功
    handleSuccess(res){
      console.log('上传成功',res)
      // 1.拼接图片对象
      const picInfo={pic:res.data.tmp_path}
      // 将拼接后的对象push 到 pics数据中
      this.addGoodsForm.pics.push(picInfo)
      console.log('已上传并存储的图片',this.addGoodsForm)
    },
    //提交到服务器
    addGoods(){

      this.$refs.addGoodsFormRef.validate(async valid=>{
        if (!valid){
          return  this.$message.error('请填写必要的表单项!')
        }

        //处理动态参数
        this.manyTableData.forEach(item=>{
          const newInfo= {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item=>{
          const newInfo= {
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        //深拷贝
        const form= _.cloneDeep(this.addGoodsForm)
        form.goods_cat=form.goods_cat.join(',')
        console.log('提交数据预览',this.addGoodsForm,form)

        //商品明必须是唯一的
        const {data:res}=await  this.$http.post('goods',form)
        console.log('添加商品提交响应',res)
        if (res.meta.status !== 201 ) return this.$message.error(res.meta.msg+'  添加商品失败!请检查网络或联系管理员')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }

  },
  computed:{
    cateId(){
      if(this.addGoodsForm.goods_cat.length ===3 ){
        return this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length-1];
      }
    },
  }

}
</script>

<style scoped>
.el-steps{
  margin:15px 0;
}
.el-step__title{
  font-size: 13px;
}
.el-checkbox{
  margin: 5px 0;
}
.previewImg{
  width: 100%;
}

.btnAdd{
  margin: 15px;
}
</style>
