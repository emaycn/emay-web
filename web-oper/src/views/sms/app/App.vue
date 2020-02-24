<template>
  <div class="app-container">
    <!-- 查询 | 操作 -->
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="客户名:">
          <el-input v-model="queryParams.clientName" />
        </el-form-item>
        <el-form-item label="应用名:">
          <el-input v-model="queryParams.appName" />
        </el-form-item>
        <el-form-item label="Appkey:">
          <el-input v-model="queryParams.appKey" />
        </el-form-item>
        <el-form-item label="服务号:">
          <el-input v-model="queryParams.appCode" />
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="queryParams.state" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="methodSearch()"
          >查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            class="filter-item"
            type="default"
            icon="el-icon-refresh"
            @click="methodClean()"
          >清除</el-button>
        </el-form-item>
        <el-form-item v-if="AuthUtils.hasAuth('APP_ADD')" label>
          <router-link to="/sms/app/add">
            <el-button type="success" icon="el-icon-circle-plus-outline">创建应用</el-button>
          </router-link>
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
      <el-table-column label="客户" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Appkey" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          <span>￥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="formatClass(scope.row.state)">{{ formatStatus(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <!-- 0--停用,1--启用 -->
          <el-button
            v-if="AuthUtils.hasAuth('APP_ONOFF')"
            :type="row.state === 1?'info':'success'"
            size="mini"
            :title="row.state === 1?'停止':'启动'"
            circle
            @click="methodOnoff(row)"
          ><svg-icon :icon-class="row.state === 1?'stop':'start'" /></el-button>
          <el-button
            v-if="AuthUtils.hasAuth('APP_PRICE')"
            type="primary"
            size="mini"
            icon="el-icon-tickets"
            title="设置单价"
            circle
            @click="priceFromSave(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="pagination.total>0"
      v-if="pagination.show"
      class="pagination"
      :total="pagination.total"
      :total-page="pagination.totalPage"
      :page="pagination.currentPageNum"
      :start.sync="queryParams.start"
      :limit.sync="queryParams.limit"
      @pagination="methodList()"
    />

    <!-- 设置单价 Dialog -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="设置单价"
      :visible.sync="priceDialogShow"
      width="600px"
    >
      <el-form
        ref="priceForm"
        :model="priceForm"
        :rules="formRules"
        label-width="100px"
        size="mini"
        class="priceForm"
        style="width: 500px; margin-left:20px;"
      >
        <el-form-item label="应用名称:">
          <el-input v-model="priceForm.appName" placeholder="请输入应用名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="设置单价:" prop="price">
          <el-input v-model="priceForm.price" type="number" placeholder="请输入单价" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="priceFormCancel('priceForm')">取消</el-button>
        <el-button size="small" type="primary" :disabled="dialogBtnClicked" @click="priceFormSubmit('priceForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { priceall } from '@/utils/Validate'
import { apiList, apiPrice, apiOnoff } from '@/api/sms/app/app.js' // 后台接口
import Pagination from '@/components/Pagination'// 分页
export default {
  name: 'Appp', // 组件名称
  components: { Pagination }, // 引用的组件
  data() { // 数据
    // 客户名验证
    var clientNameReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('客户名不能为空'))
      } else {
        callback()
      }
    }
    // 单价
    var priceReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('单价不能为空'))
      } else if (!priceall(value)) {
        callback(new Error('单价格式有误'))
      } else {
        callback()
      }
    }
    return {
      // 表格数据
      tableKey: 0,
      tableData: null,
      tableDataLoading: false, // table数据加载中...
      // 查询参数
      queryParams: {
        clientName: '',
        appName: '',
        appKey: '',
        state: '-999',
        start: 0, // 起始数据位置
        limit: 20 // 数据条数
      },
      // 分页参数
      pagination: {
        show: true, // 展示
        total: 0, // 总条数
        totalPage: 1, // 总页数
        currentPageNum: 1// 当前页面
      },
      // 设置价格表单
      priceForm: {
        appId: 0,
        appName: '',
        price: 0
      },
      // 表单验证规则
      formRules: {
        clientName: [{ required: true, trigger: 'blur', validator: clientNameReg }],
        price: [{ required: true, trigger: 'blur', validator: priceReg }]
      },
      // 文件上传表单
      importForm: {
      },
      overFileMaxSize: false, // 文件大小超出限制
      // 其他数据
      dialogBtnClicked: false,
      priceDialogShow: false,
      stateOptions: [{
        value: '-999',
        label: '全部'
      }, {
        value: '1',
        label: '启用'
      }, {
        value: '0',
        label: '停用'
      }]
    }
  },
  created() {
    this.methodList() // 获取表格数据
  },
  mounted() {
  },
  activated() {
    // 激活刷新
    if (this.$route.params.flush === 'on') {
      this.methodList() // 获取表格数据
    }
  },
  updated() {
  },
  methods: {
    // 获取表格数据
    methodList() {
      this.pagination.show = false // 关闭分页
      this.tableDataLoading = true // 打开loading...
      apiList(this.queryParams).then(response => {
        // 给tableData赋值
        this.tableData = response.result.list
        // 分页数据
        this.pagination.total = response.result.totalCount // 总条数
        this.pagination.totalPage = response.result.totalPage // 总页数
        this.pagination.currentPageNum = response.result.currentPageNum // 当前页码
        // 视图操作
        this.tableDataLoading = false // 关闭loading...
        this.pagination.show = true // 显示分页
      })
    },
    // 查询
    methodSearch() {
      this.queryParams.start = 0
      this.methodList()
    },
    // 清除
    methodClean() {
      this.queryParams = {}
      this.queryParams.state = '-999'
      this.queryParams.start = 0
      this.queryParams.limit = 20
      this.methodList()
    },
    // PriceForm Save
    priceFromSave(row) {
      this.priceDialogShow = true
      this.dialogBtnClicked = false
      if (row === null || row === undefined) {
        this.priceForm = {}
      } else {
        this.priceForm.appId = row.id
        this.priceForm.appName = row.appName
        this.priceForm.price = row.price
      }
    },
    priceFormCancel(formName) {
      this.priceDialogShow = false
    },
    priceFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogBtnClicked = true
          apiPrice(this.priceForm)
            .then(response => {
              this.$message({
                message: '单价设置成功',
                type: 'success'
              })
              setTimeout(() => {
                this.priceFormCancel()
                this.methodList()
              }, 500)
            })
            .catch(error => {
              this.dialogBtnClicked = false
              this.$message.error(error)
            })
        } else {
          return false
        }
      })
    },
    // 启用/停用
    methodOnoff(row) {
      this.$confirm('确定要' + (row.state === 1 ? '停止' : '启动') + '应用["' + row.appName + '"]?', '启动/停用确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableDataLoading = true
        apiOnoff({
          appId: row.id,
          state: (row.state === 1 ? 0 : 1)
        }).then(response => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: (row.state === 1 ? '停止' : '启动') + '成功!'
            })
            this.methodList()
          }
        }).catch(() => {
          this.tableDataLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 格式化状态
    formatStatus(state) {
      if (state === 1) {
        return '启用'
      } else {
        return '停用'
      }
    },
    // 格式化class
    formatClass(state) {
      if (state === 1) {
        return 'green'
      } else {
        return 'red'
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
