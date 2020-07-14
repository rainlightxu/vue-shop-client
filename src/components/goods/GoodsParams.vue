<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" left show-icon :closable="false"></el-alert>
      <label>选择商品分类：</label>
      <el-cascader
        v-model="goods_cat"
        :options="cateList"
        :props="cascaderProps"
        @change="CateChanged"
        :clearable="true"
        style="margin:10px 0px;"
      ></el-cascader>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="this.goods_cat.length === 0 ? true : false"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="params" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  style="margin-right:10px;"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="handleEditParams(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDelParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="this.goods_cat.length === 0 ? true : false"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="attributes" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  style="margin-right:10px;"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="handleEditParams(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDelParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-alert
        v-show="checkNameFlag"
        :title="titleText + '不能为空'"
        type="error"
        style="margin:10px 0"
      ></el-alert>
      <div style="display:flex;align-items:center;">
        <label style="width:100px;">{{this.titleText}}</label>
        <el-input type="text" v-model="attr_name" @blur="checkName"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-alert
        v-show="checkNameFlag"
        :title="titleText + '不能为空'"
        type="error"
        style="margin:10px 0"
      ></el-alert>
      <div style="display:flex;align-items:center;">
        <label style="width:100px;">{{this.titleText}}</label>
        <el-input type="text" v-model="attr_name" @blur="checkName"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'many',
      params: [],
      attributes: [],
      goods_cat: [],
      cateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      addDialogVisible: false,
      editDialogVisible: false,
      attr_name: '',
      attr_id: '',
      checkNameFlag: false,
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    getGoodsCateList() {
      this.$http.get('/categories').then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.cateList = res.data.data
      })
    },
    CateChanged() {
      if (this.goods_cat.length !== 3) {
        this.goods_cat = []
        this.params = []
        this.attributes = []
        return
      }
      this.getParamsorAttr()
    },
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsorAttr()
    },
    getParamsorAttr() {
      this.$http
        .get(`categories/${this.cateID}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取动态参数失败')
          }
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            item.inputVisible = false
            item.inputValue = ''
          })
          if (this.activeName === 'many') {
            this.params = res.data.data
          } else {
            this.attributes = res.data.data
          }
        })
    },
    handleEditParams(id) {
      this.$http.get(`categories/${this.cateID}/attributes/${id}`).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取参数名称失败')
        }
        this.attr_name = res.data.data.attr_name
        this.attr_id = res.data.data.attr_id
        console.log(res)
      })
      this.editDialogVisible = true
    },
    async handleDelParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('您取消了删除')
      }
      this.$http
        .delete(`categories/${this.cateID}/attributes/${id}`)
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.getParamsorAttr()
          this.$message.success('删除成功')
        })
    },
    addDialogClosed() {
      this.attr_name = ''
    },
    editDialogClosed() {
      this.attr_name = ''
    },
    checkName() {
      if (!this.attr_name) {
        this.checkNameFlag = true
      } else {
        this.checkNameFlag = false
      }
    },
    addParams() {
      if (this.attr_name) {
        this.$http
          .post(`categories/${this.cateID}/attributes`, {
            attr_name: this.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加' + this.titleText + '失败')
            }
            this.addDialogVisible = false
            this.getParamsorAttr()
            this.$message.success('添加' + this.titleText + '成功')

            console.log(res)
          })
      } else {
        this.checkName()
      }
    },
    editParams() {
      if (this.attr_name) {
        this.$http
          .put(`categories/${this.cateID}/attributes/${this.attr_id}`, {
            attr_name: this.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            console.log(res)
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改' + this.titleText + '失败')
            }
            this.addDialogVisible = false
            this.getParamsorAttr()
            this.$message.success('修改' + this.titleText + '成功')
            this.editDialogVisible = false
          })
      } else {
        this.checkName()
      }
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.$http
        .put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$$message.error('修改参数失败')
          }
          this.$message.success('修改参数成功')
        })
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.$http
        .put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$$message.error('修改参数失败')
          }
          this.$message.success('修改参数成功')
        })
    }
  },
  computed: {
    cateID() {
      if (this.goods_cat.length === 3) {
        return this.goods_cat[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.input-new-tag {
  width: 100px;
}
</style>