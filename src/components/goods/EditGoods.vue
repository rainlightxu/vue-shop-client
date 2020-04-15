<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品详细信息 -->
    <el-form :model="editForm" :rules="editFormRules" label-width="70px" label-position="left">
      <el-form-item label="商品ID" label-width="100px">
        <el-input v-model="editForm.goods_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="goods_name" label-width="100px">
        <el-input v-model="editForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price" label-width="100px">
        <el-input v-model="editForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number" label-width="100px">
        <el-input v-model="editForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight" label-width="100px">
        <el-input v-model="editForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍" prop="goods_introduce" label-width="100px">
        <el-input v-model="editForm.goods_introduce"></el-input>
        <!-- <quill-editor v-model="editForm.goods_introduce" ></quill-editor> -->
      </el-form-item>
      <el-button type="primary" @click="submitEditGoods" size="medium">提交</el-button>
      <!-- <el-form-item label="商品状态" prop="goods_state" label-width="100px">
        <el-radio-group v-model="editForm.goods_state">
          <el-radio :label="0">未通过</el-radio>
          <el-radio :label="1">审核中</el-radio>
          <el-radio :label="2">已通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否热销" prop="is_promote" label-width="100px">
        <el-switch v-model="editForm.is_promote" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item label="热销数量" prop="hot_mumber" label-width="100px" v-show="editForm.is_promote === true">
        <el-input v-model="editForm.hot_mumber"></el-input>
      </el-form-item>-->
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      editForm: {},
      editFormRules: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      }
    }
  },
  created() {
    this.getOneGoodsInfo()
  },
  methods: {
    async getOneGoodsInfo() {
      const { data: res } = await this.$http.get(`goods/${this.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品详细信息失败')
      }
      this.$message.success('获取商品详细信息成功')
      this.editForm = res.data
    },
    async submitEditGoods(){
        const {data:res} = await this.$http.put(`goods/${this.id}`,this.editForm)
        if(res.meta.status !== 200) {
            return this.$message.error("编辑商品失败")
        }
        this.$message.success("编辑商品成功")
        this.$router.push("/goods")
    }
  }
}
</script>
<style lang="less" scoped>
.ql-editor {
  img {
    width: 100%;
  }
}
</style>