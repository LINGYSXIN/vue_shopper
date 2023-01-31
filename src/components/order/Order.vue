<template>
<div>
  <!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
    <!--    面包屑导航条目-->
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item >订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
          @clear="getOrderList"
        >
          <template #append>
            <el-button @click="getOrderList" ><el-icon><search/></el-icon></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!--    数据渲染-->
    <el-table
      :data="orderList"
      border
      stripe
    >
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price" width="80px" ></el-table-column>
      <el-table-column label="是否付款" prop="order_pay"  width="80px">
        <template #default="scope">
          <el-tag v-if="scope.row.order_pay === '0'" class="ml-2" type="danger">未付款</el-tag>
          <el-tag v-else class="ml-2" type="success">已付款</el-tag>
        </template>

      </el-table-column>
      <el-table-column label="下单时间"  width="180px">
        <template #default="scope">
          {{ $filters.dateFormat(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="130px">
        <template #default="scope">
          <el-button  type="primary"  size="mini" @click="showEditDialog"><el-icon><edit/></el-icon></el-button>
          <el-button  type="success"   size="mini" @click="showProgressBox(scope.row.order_id)"><el-icon><Location /></el-icon></el-button>
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
<!--修改地址-->
  <el-dialog
    v-model="editDialogVisible"
    title="修改地址"
    width="50%"
    @close="editHandleClose"
  >
    <el-form
      ref="editAdressFormRef"
      :model="editOrderForm"
      :rules="editOrderFormRules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
    <el-form-item label="省市区/县" prop="address1">
      <el-cascader
        v-model="editOrderForm.address1"
        :options="addressList"
        :props="cascaderProps"
        placeholder="请选择"
      />
    </el-form-item>
    <el-form-item label="详细地址" prop="address2">
      <el-input v-model="editOrderForm.address2" />
    </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">
          确认修改
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!--查看物流-->
  <el-dialog
    v-model="progressDialogVisible"
    title="物流进度"
    width="50%"
  >
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>

  </el-dialog>
</div>
</template>

<script>
import { regionData } from 'element-china-area-data'
export default {
  name: "Order",
  data(){
    return{
      // 查询参数对象
      queryInfo:{
        //查询内容，可为空
        query:'',
        //页面数量
        pagenum: 1,
        //单页条目
        pagesize:5,
      },
      // 订单数据总数
      total:0,
    //  订单列表数据
      orderList:[],
    //  修改物流对话框
      editDialogVisible:false,
      // 修改地址表单
      editOrderForm:{
        address1:[],
        address2:'',
      },
      // 修改地址 表格验证
      editOrderFormRules: {
        address1: [{required: true, message: '请选择省市/县', trigger: 'blur'}],
        address2:[{required: true, message: '请输入详细地址', trigger: 'blur'}],
      },

      //  指定级联选择器的配置要求
      cascaderProps:{
        value:'value',
        label:'label',
        children:'children',
        expandTrigger: 'hover',

      },
      // 修改地址所用地址
      addressList:regionData,
      // 查看物流对话框
      progressDialogVisible:false,
      // 物流信息
      activities:{},








    }
  },
  created() {
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      console.log('查询参数',this.queryInfo)
      const {data:res}= await this.$http.get('orders',{params:this.queryInfo})
      console.log('订单数据',res)
      if (res.meta.status !== 200) return this.$message.error('获取订单数据失败!')
      this.orderList=res.data.goods
      this.total=res.data.total
      this.queryInfo.pagenum=res.data.pagenum - '0'

      this.$message.success('获取订单数据成功')

    },
    // 分页大小发生改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getOrderList()
    },
    // 分页大小发生改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getOrderList()
    },
    //打开修改地址对话框
    showEditDialog(){
      this.editDialogVisible =true
    },
    //修改地址对话框关闭
    editHandleClose(){
      this.$refs.editAdressFormRef.resetFields()
    },
    // 打开查看物流
    async showProgressBox(order_id){
      this.progressDialogVisible=true
      const {data:res} =  await this.$http.get('/kuaidi/1106975712662')
      console.log('物流信息',res)
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.activities=res.data
      this.activities.forEach(item => {
        item.timestamp=item.time
        item.content=item.context
      } )
      this.$message.success('获取物流状态成功')
    }
  }
}
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>
