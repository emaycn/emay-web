<template>
  <div class="app-container">
    <!-- 查询 | 操作 -->
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
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
  </div>
</template>

<script>
import { priceall } from '@/utils/Validate'
import { apiList } from '@/api/sms/app/app.js' // 后台接口
import Pagination from '@/components/Pagination'// 分页
export default {
  name: 'Appp', // 组件名称
  components: { Pagination }, // 引用的组件
  data() { // 数据
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
        appKey: '',
        state: null,
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
      // 表单验证规则
      formRules: {
        price: [{ required: true, trigger: 'blur', validator: priceReg }]
      },
      // 文件上传表单
      importForm: {
      },
      overFileMaxSize: false, // 文件大小超出限制
      // 其他数据
      priceDialogShow: false,
      stateOptions: [{
        value: -1,
        label: '请选择'
      }, {
        value: 1,
        label: '启用'
      }, {
        value: 0,
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
      if (this.queryParams.state === null || this.queryParams.state === undefined) {
        this.queryParams.state = -1
      }
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
      // this.queryParams.appKey = ''
      // this.queryParams.state = '-999'
      this.queryParams = {}
      this.queryParams.start = 0
      this.queryParams.limit = 20
      this.methodList()
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
