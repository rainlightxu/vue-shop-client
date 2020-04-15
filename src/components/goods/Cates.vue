<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品分类卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 使用第三方组件vue-table-with-tree-grid实现列表的展示 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :show-index="true"
        :expand-type="false"
        :selection-type="false"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            stype="color:green"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-circle-close" style="color:red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="error" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="showDeleteCateDialog(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 使用el-table实现列表的展示 -->
      <!-- <el-table :data="cateList" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效"></el-table-column>
        <el-table-column prop="cat_level" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>-->
    </el-card>
    <!-- 添加分类信息对话框 注意：无法正常显示分类信息，有可能时el-cascader组件的问题 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="parentCateList"
            :props="casProps"
            v-model="selectedCateKeys"
            @change="parentCateChanged"
            :clearable="true"
          ></el-cascader>
          
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editCateFormRef" label-width="70px">
        <el-form-item label="分类名称" prop="cat_name" label-width="100px">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      cateId: '',
      editForm: {
        cat_id: 0,
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      selectedCateKeys: [],
      parentCateList: [],
      casProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedCateKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }

      this.$message.success('获取商品分类成功')
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.cateList)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      // console.log(res.data)
      this.parentCateList = res.data
    },
    parentCateChanged() {
      // console.log(this.selectedCateKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedCateKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedCateKeys[
          this.selectedCateKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedCateKeys.length
        return
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功败')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    async showEditCateDialog(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200)
        return this.$message.error('查询分类信息失败')
      this.editForm = res.data
      //   console.log(this.editForm)
      this.editCateDialogVisible = true
    },
    async editCateInfo() {
      const { data: res } = await this.$http.put(
        'categories/' + this.editForm.cat_id,
        { cat_name: this.editForm.cat_name }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新分类失败')
      }
      this.$message.success('更新分类成功')
      this.getCateList()
      this.editCateDialogVisible = false
    },
    async showDeleteCateDialog(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('categories/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除商品分类失败！')
      }

      this.$message.success('删除商品分类成功！')
      this.getCateList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>