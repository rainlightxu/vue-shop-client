<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-calendar v-model="date" :range="['2019-03-04', '2019-03-24']"></el-calendar>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
        return{
            date:new Date()
        }
    }
}
</script>
<style lang="less" scoped>
</style>