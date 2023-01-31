<template>
<div>
  <!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right" separator="'>'">
    <!--    面包屑导航条目-->
    <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item >数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片布局区域-->
  <el-card>
<!--    为echarts 准备一个具备大小的dom-->
    <div id="main" style="width:650px ; height: 300px"></div>

  </el-card>

</div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
  name: "Report",
  data(){
    return {
      // 报告数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid:{
          left:'3%',
          right:'4%',
          bottom:'3%',
          containLabel:true
        },
        xAxis:[
          {
            boundaryGap:false
          }
        ],
        YAxis:[
          {
            type:'value'
          }
        ]
      }
    }
  },
  created() {
  },
  async mounted() {
    //基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    const {data:res}=await  this.$http.get('reports/type/1')
    console.log('报告数据',res)
    if (res.meta.status !== 200) return this.$message.error('获取报告数据失败')

    const result=_.merge(res.data,this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  methods:{

  }

}
</script>

<style scoped>

</style>
