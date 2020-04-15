<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- echarts容器 -->
    <div id="main" style="width:750px;height:400px;"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'loadsh'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取报表数据失败')

    // 指定图表的配置项和数据 使用loadsh合并两个对象，以便显示鼠标动态效果
    const result = _.merge(res.data,this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>
<style lang="less" scoped>
</style>