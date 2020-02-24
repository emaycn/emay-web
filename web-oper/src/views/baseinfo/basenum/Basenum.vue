<template>
  <div class="app-container">
    <!-- 数据查询|按钮操作 -->
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="号码段:">
          <el-input v-model="queryParams.number" :maxlength="7" />
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="methodSearch">查询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="default" icon="el-icon-refresh" @click="cleanQueryParams">清除</el-button>
        </el-form-item>
        <el-form-item v-if="AuthUtils.hasAuth('BASENUMBER_ADD')" label="">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="addFromOpen()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格部分 -->
    <!-- highlight-current-row|是否要高亮当前行 -->
    <!-- stripe|是否为斑马纹table -->
    <!-- border|是否带有纵向边框 -->
    <!-- fit|列的宽度是否自撑开 -->
    <el-table
      :key="tableKey"
      v-loading="tableDataLoading"
      :data="tableData"
      border
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 数据 -->
      <el-table-column label="序号" align="center" width="60" type="index" />
      <el-table-column label="号码段" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商" align="center">
        <template slot-scope="scope">
          <span>{{ formatOperator(scope.row.operatorCode) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="最后更改时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <!-- 操作按钮 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button v-if="AuthUtils.hasAuth('BASENUMBER_MODIFY')" type="warning" size="mini" icon="el-icon-edit" title="编辑" circle @click="modifyFromOpen(row)" />
          <el-button v-if="AuthUtils.hasAuth('BASENUMBER_DELETE')" type="danger" size="mini" icon="el-icon-delete" title="删除" circle @click="methodDelete(row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      v-if="paginationShow"
      class="pagination"
      :total="total"
      :total-page="totalPage"
      :page="currentPageNum"
      :start.sync="queryParams.start"
      :limit.sync="queryParams.limit"
      @pagination="methodGetList"
    />

    <!-- 添加 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加基础号段"
      :visible.sync="addDialogShow"
      width="580px"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="formRules"
        label-width="130px"
        size="mini"
        class="addForm"
        style="width: 350px; margin-left:50px;"
      >
        <el-form-item label="号码段:" prop="number">
          <el-input v-model="addForm.number" :maxlength="7" />
        </el-form-item>
        <el-form-item label="运营商:">
          <el-select v-model="addForm.operatorCode" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in operatorList"
              :key="item.id"
              :label="item.operator"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addFormCancel('addForm')">取消</el-button>
        <el-button size="small" type="primary" :disabled="dialogBtnClicked" @click="addFormSubmit('addForm')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="修改基础号段"
      :visible.sync="modifyDialogShow"
      width="580px"
    >
      <el-form
        ref="modifyForm"
        :model="modifyForm"
        :rules="formRules"
        label-width="130px"
        size="mini"
        class="modifyForm"
        style="width: 350px; margin-left:50px;"
      >
        <el-form-item label="号码段:" prop="number">
          <el-input v-model="modifyForm.number" :maxlength="7" />
        </el-form-item>
        <el-form-item label="运营商:">
          <el-select v-model="modifyForm.operatorCode" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in operatorList"
              :key="item.id"
              :label="item.operator"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="modifyFormCancel('modifyForm')">取消</el-button>
        <el-button size="small" type="primary" :disabled="dialogBtnClicked" @click="modifyFormSubmit('modifyForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { apiList, apiDelete, apiAdd, apiModify } from '@/api/baseinfo/basenum.js' // 后台接口
import Pagination from '@/components/Pagination'// 分页
export default {
  name: 'Basenum', // 组件名称
  components: { Pagination }, // 引用的组件
  data() { // 数据
    // 空号验证
    var numberReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('号码段不能为空'))
      } else {
        callback()
      }
    }
    return {
      dialogBtnClicked: false,
      addDialogShow: false,
      modifyDialogShow: false,
      // 查询参数
      queryParams: {
        number: '', // 号码段
        start: 0, // 起始数据位置
        limit: 20 // 数据条数
      },
      // 添加表单
      addForm: {
        number: '',
        operatorCode: 'CM'
      },
      // 修改表单
      modifyForm: {
        id: 0,
        number: '',
        operatorCode: 'CM'
      },
      // 表单验证规则
      formRules: {
        number: [{ required: true, trigger: 'blur', validator: numberReg }]
      },
      // 分页参数
      paginationShow: true,
      total: 0, // 分页-总条数
      totalPage: '', // 分页-总页数
      currentPageNum: '', // 分页-当前页码
      // 列表数据
      tableKey: 0,
      tableData: null,
      tableDataLoading: false, // table数据加载中...
      // 其他数据
      // 下拉选项数据
      operatorList: [
        { 'id': 'CM', 'operator': '移动' },
        { 'id': 'CU', 'operator': '联通' },
        { 'id': 'CT', 'operator': '电信' }
      ]
    }
  },
  created() {
    console.log('1=created')
    this.methodGetList() // 获取表格数据
  },
  mounted() {
    console.log('2=mounted')
  },
  activated() {
    console.log('3=activated')
    if (this.$route.params.flush === 'on') {
      this.methodGetList() // 获取表格数据
    }
  },
  updated() {
    console.log('4=updated')
  },
  methods: {
    methodGetList() { // 获取表格数据
      this.paginationShow = false // 关闭分页
      this.tableDataLoading = true // 打开loading...
      apiList(this.queryParams).then(response => {
        this.tableData = response.result.list // 给tableData赋值
        this.total = response.result.totalCount // 总条数
        this.totalPage = response.result.totalPage // 总页数
        this.currentPageNum = response.result.currentPageNum // 当前页码
        this.tableDataLoading = false // 关闭loading...
        this.paginationShow = true // 显示分页
      })
    },
    methodSearch() { // 查询
      this.queryParams.start = 0
      this.methodGetList()
    },
    methodDelete(row) { // 删除方法
      this.$confirm('确定要删除号码段["' + row.number + '"]?', '删除确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDelete({
          id: row.id
        }).then(response => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.methodGetList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    cleanQueryParams() { // 清除查询条件
      this.queryParams.number = ''
      this.queryParams.start = 0
      this.queryParams.limit = 20
      this.methodGetList()
    },
    // 添加
    addFromOpen() {
      this.addDialogShow = true
      this.dialogBtnClicked = false
    },
    addFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogBtnClicked = true
          apiAdd(this.addForm).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            setTimeout(() => {
              this.addFormCancel()
              this.methodGetList()
            }, 500)
          }).catch(error => {
            this.dialogBtnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    addFormCancel(formName) {
      this.addDialogShow = false
      this.addForm.number = ''
    },
    // 修改
    modifyFromOpen(row) {
      this.modifyDialogShow = true
      this.dialogBtnClicked = false
      this.modifyForm.id = row.id
      this.modifyForm.number = row.number
      this.modifyForm.operatorCode = row.operatorCode
    },
    modifyFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogBtnClicked = true
          apiModify(this.modifyForm).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            setTimeout(() => {
              this.modifyFormCancel()
              this.methodGetList()
            }, 500)
          }).catch(error => {
            this.dialogBtnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    modifyFormCancel(formName) {
      this.modifyDialogShow = false
      this.modifyForm.number = ''
    },
    formatOperator(operCode) {
      for (var item of this.operatorList) {
        if (item.id === operCode) {
          return item.operator
        }
      }
    }
  }
}
</script>

<style>
.green {
  color: green;
}
.red {
  color: red;
}
</style>
