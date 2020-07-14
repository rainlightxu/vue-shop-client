<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getOrdersList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="订单ID：">
                <span>{{ props.row.order_id }}</span>
              </el-form-item>
              <el-form-item label="用户ID：">
                <span>{{ props.row.user_id }}</span>
              </el-form-item>
              <el-form-item label="贸易单号：">
                <span>{{ props.row.trade_no }}</span>
              </el-form-item>
              <el-form-item label="发票抬头：">
                <span>{{ props.row.order_fapiao_title }}</span>
              </el-form-item>
              <el-form-item label="发票公司：">
                <span>{{ props.row.order_fapiao_company }}</span>
              </el-form-item>
              <el-form-item label="发票内容：">
                <span>{{ props.row.order_fapiao_content }}</span>
              </el-form-item>
              <el-form-item label="支付方式：">
                <el-radio v-model="props.row.order_pay" disabled label="0">未支付</el-radio>
                <el-radio v-model="props.row.order_pay" disabled label="1">支付宝</el-radio>
                <el-radio v-model="props.row.order_pay" disabled label="2">微信</el-radio>
                <el-radio v-model="props.row.order_pay" disabled label="3">银行卡</el-radio>
              </el-form-item>
              <el-form-item label="收获地址：">
                <span>{{ props.row.consignee_addr }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="300px"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="success" v-if="scope.row.pay_status === '0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="170px"></el-table-column>

        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <!-- 修改地址按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditLocationDialog(scope.row.order_id)"
            ></el-button>
            <!-- 查看物流信息按钮 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改订单对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editlocationDialogVisible"
      width="50%"
      center
      @close="locationDialogClosed"
    >
      <el-form ref="locationForm" :model="locationForm" label-width="80px">
        <el-form-item label="省市区/县">
          <el-cascader :options="cityData" v-model="locationForm.location" :props="cascaderProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="locationForm.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改订单状态 -->
      <el-form ref="statusFormRef" :model="statusForm" label-width="80px">
        <el-form-item label="订单编号">
          <el-input v-model="statusForm.order_number"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-radio v-model="statusForm.pay_status" label="0" @change="payStatusChanged">未支付</el-radio>
          <el-radio v-model="statusForm.pay_status" label="1" @change="payStatusChanged">已付款</el-radio>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio v-model="statusForm.order_pay" label="0">未支付</el-radio>
          <el-radio v-model="statusForm.order_pay" label="1">支付宝</el-radio>
          <el-radio v-model="statusForm.order_pay" label="2">微信</el-radio>
          <el-radio v-model="statusForm.order_pay" label="3">银行卡</el-radio>
        </el-form-item>
        <el-form-item label="订单价格">
          <el-input v-model="statusForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="是否发货">
          <el-radio v-model="statusForm.is_send" label="否">未发货</el-radio>
          <el-radio v-model="statusForm.is_send" label="是">已发货</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editlocationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersList: [],
      total: 0,
      editlocationDialogVisible: false,
      locationForm: {
        location: [],
        address: ''
      },
      statusForm: {
        order_id: 0,
        is_send: '',
        order_pay: '',
        order_price: 0,
        order_number: '',
        pay_status: ''
      },
      cityData: cityData,
      cascaderProps: {
        expandTrigger: true
      },
      progressVisible: false,
      progressInfo: {}
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // async getOrdersList() {
    //   const { data: res } = await this.$http.get('orders', {
    //     params: this.queryInfo
    //   })
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取订单列表失败')
    //   }
    //   this.$message.success('获取订单列表成功')
    //   this.ordersList = res.data.goods
    //   this.total = res.data.total
    // },
    getOrdersList() {
      this.$http.get('ordeasdfdadfrsa', {
        params: this.queryInfo
      }).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取订单列表失败')
      // }
      // this.$message.success('获取订单列表成功')
      // this.ordersList = res.data.goods
      // this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    },
    async showEditLocationDialog(id) {
      this.editlocationDialogVisible = true
      const { data: res } = await this.$http.get('orders/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单详情失败')
      }
      this.$message.success('获取订单详情成功')
      this.statusForm = res.data
    },
    locationDialogClosed() {
      this.$refs.locationForm.resetFields()
    },
    async showProgressDialog() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data
      this.progressVisible = true
    },
    async submitEditInfo() {
      const { data: res } = await this.$http.put(
        'orders/' + this.statusForm.order_id,
        {
          is_send: this.statusForm.is_send,
          order_pay: this.statusForm.order_pay,
          order_price: this.statusForm.order_price,
          order_number: this.statusForm.order_number,
          pay_status: this.statusForm.pay_status
        }
      )
      if (res.meta.status !== 201) {
        return this.$message.error('更改订单状态失败')
      }
      this.$message.success('更改订单状态成功')
      this.editlocationDialogVisible = false
      this.getOrdersList()
    },
    payStatusChanged(select){
      this.statusForm.pay_status = select
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>