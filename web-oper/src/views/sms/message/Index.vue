<template>
  <div class="app-container">
    <!-- 查询 | 操作 -->
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" :model="queryParams" :rules="formRules">
        <!-- query -->
        <el-form-item label="提交时间:">
          <el-date-picker
            v-model="queryParams.startDate"
            placeholder="选择日期时间"
            :type="dateTypeConfig[dateType-1].type"
            :format="dateTypeConfig[dateType-1].format"
            :value-format="dateTypeConfig[dateType-1].vformat"
            :picker-options="pickerOptionsStart"
            default-time="00:00:00"
          />&nbsp;-&nbsp;
          <el-date-picker
            v-model="queryParams.endDate"
            placeholder="选择日期时间"
            :type="dateTypeConfig[dateType-1].type"
            :format="dateTypeConfig[dateType-1].format"
            :value-format="dateTypeConfig[dateType-1].vformat"
            :picker-options="pickerOptionsEnd"
            default-time="23:59:59"
          />
        </el-form-item>
        <el-form-item label="AppKey:">
          <el-input v-model="queryParams.appKey" />
        </el-form-item>
        <el-form-item label="客户:">
          <el-input v-model="queryParams.clientName" />
        </el-form-item>
        <el-form-item label="内容:">
          <el-input v-model="queryParams.content" />
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="queryParams.mobile" />
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
        <el-form-item label="状态码:">
          <el-input v-model="queryParams.reportCode" />
        </el-form-item>
        <el-form-item label="批次号:">
          <el-input v-model="queryParams.batchNo" />
        </el-form-item>
        <!-- control -->
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
      :key="table.key"
      v-loading="table.loading"
      :data="table.data"
      border
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 数据 -->
      <el-table-column label="序号" align="center" width="60" type="index" />
      <!-- custom -->
      <el-table-column label="企业/应用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clientName }}</span>
          <br>
          <span>{{ scope.row.appKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批次号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.batchNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号/SmsId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
          <br>
          <span>{{ scope.row.smsId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="条数/金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cost }}条</span>
          <br>
          <span>￥{{ scope.row.charge }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="发送通道" align="center">
        <span>默认</span>
      </el-table-column>
      <el-table-column label="时间" align="center" width="200">
        <template slot-scope="scope">
          <span>提交时间: {{ scope.row.submitTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <br>
          <span>发送时间: {{ scope.row.sendTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <br>
          <span>状态时间: {{ scope.row.reportTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ formatState(scope.row.state) }}</span>
          <br>
          <span>{{ scope.row.reportCode }}</span>
        </template>
      </el-table-column>

      <!-- 操作按钮 -->
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-show="pagination.total>0"
      v-if="pagination.show"
      class="pagination"
      background
      layout="total, sizes, prev, slot, next"
      :current-page.sync="pagination.currentPageNum"
      :page-size="queryParams.limit"
      :page-sizes="[20,50,100]"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <span>第 {{ pagination.currentPageNum }} / {{ pagination.totalPage }} 页</span>
    </el-pagination>

  </div>
</template>

<script>
import { apiList } from '@/api/sms/message/smsSendDetail.js' // 后台接口
import { getDefaultDate } from '@/utils/DateUtils.js' // 工具类
export default {
  name: 'SmsSendDetail', // 组件名称
  data() {
    return {
      // 表格数据
      table: {
        key: 0,
        data: [],
        loading: false // table数据加载中...
      },
      // 查询参数
      queryParams: {
        appKey: '',
        clientName: '',
        content: '',
        reportCode: '',
        mobile: '',
        appCode: '',
        batchNo: '',
        state: null,
        startDate: null,
        endDate: null,
        startId: null,
        pageType: 'Next',
        start: 0, // 起始数据位置
        limit: 20 // 数据条数
      },
      // 分页参数
      pagination: {
        show: true, // 展示
        total: 0, // 总条数
        totalPage: 1, // 总页数
        currentPageNum: 1 // 当前页面
      },
      firstId: null,
      lastId: null,
      oldNum: 0,
      // 表单验证规则
      formRules: {
        startDate: [
          { required: true, message: '开始日期不能为空', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '结束日期不能为空', trigger: 'blur' }
        ]
      },
      // 其他数据
      stateOptions: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 3,
          label: '发送中'
        },
        {
          value: 4,
          label: '成功'
        },
        {
          value: 5,
          label: '失败'
        },
        {
          value: 6,
          label: '未知'
        }
      ],
      dateType: 3, // 日期方式
      dateTypeConfig: [
        {
          type: 'year',
          format: 'yyyy',
          vformat: 'yyyy'
        },
        {
          type: 'month',
          format: 'yyyy-MM',
          vformat: 'yyyy-MM'
        },
        {
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          vformat: 'yyyy-MM-dd HH:mm:ss'
        }
      ],
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.queryParams.endDate) {
            return (
              time.getTime() >= new Date(this.queryParams.endDate).getTime()
            )
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.queryParams.startDate) {
            return (
              time.getTime() <= new Date(this.queryParams.startDate).getTime()
            )
          }
        }
      }
    }
  },
  created() {
    this.initOptions()
    this.methodList() // 获取表格数据
  },
  mounted() {},
  activated() {
    // 激活刷新
    if (this.$route.params.flush === 'on') {
      this.methodList() // 获取表格数据
    }
  },
  updated() {},
  destroyed() {},
  methods: {
    // 获取表格数据
    methodList() {
      // 初始化日期
      if (this.queryParams.startDate === null) {
        this.queryParams.startDate =
          getDefaultDate('yyyy-MM-dd', 0) + ' 00:00:00'
      }
      if (this.queryParams.endDate === null) {
        this.queryParams.endDate =
          getDefaultDate('yyyy-MM-dd', 0) + ' 23:59:59'
      }
      this.pagination.show = false // 关闭分页
      this.table.loading = true // 打开loading...
      apiList(this.queryParams).then(response => {
        // 给table.data赋值
        this.table.data = response.result.list
        // 分页数据
        this.pagination.total = response.result.totalCount // 总条数
        this.pagination.totalPage = response.result.totalPage // 总页数
        this.pagination.currentPageNum = response.result.currentPageNum // 当前页码
        // 视图操作
        this.table.loading = false // 关闭loading...
        this.pagination.show = true // 显示分页
        this.setStartId()
      })
    },
    // 查询
    methodSearch() {
      this.firstId = null
      this.lastId = null
      this.queryParams.start = 0
      this.queryParams.startId = null
      this.methodList()
      this.oldNum = 0
    },
    // 清除
    methodClean() {
      this.queryParams.appKey = null
      this.queryParams.clientName = null
      this.queryParams.content = null
      this.queryParams.reportCode = null
      this.queryParams.mobile = null
      this.queryParams.appCode = null
      this.queryParams.state = null
      this.queryParams.batchNo = null
      this.queryParams.startId = null
      this.queryParams.startDate = getDefaultDate('yyyy-MM-dd', 0) + ' 00:00:00'
      this.queryParams.endDate = getDefaultDate('yyyy-MM-dd', 0) + ' 23:59:59'
      this.queryParams.start = 0
      this.queryParams.limit = 20
      this.queryParams.pageType = 'Next'

      this.firstId = null
      this.lastId = null
      this.oldNum = 0

      this.methodList()
    },
    formatState(state) {
      for (var tmp of this.stateOptions) {
        if (tmp.value === state) {
          return tmp.label
        }
      }
    },
    // 分页
    handleCurrentChange(nextNum) {
      console.log('页码变更：' + this.oldNum + '--->' + nextNum)
      if (this.oldNum < nextNum) {
        // 下一页
        this.queryParams.startId = this.lastId
        this.queryParams.pageType = 'Next'
      } else {
        // 上一页
        this.queryParams.startId = this.firstId
        this.queryParams.pageType = 'Previous'
      }
      this.queryParams.start = (nextNum - 1) * this.queryParams.limit
      this.methodList()
    },
    // 每页显示条数变更
    handleSizeChange(val) {
      console.log('每页显示条数变更为：' + val + '条')
      this.queryParams.limit = val
      this.firstId = null
      this.lastId = null
      this.queryParams.start = 0
      this.queryParams.startId = null
      this.oldNum = 0
      this.handleCurrentChange(1)
    },
    // 给startId赋值
    setStartId() {
      if (this.table.data !== null && this.table.data.length > 0) {
        this.firstId = this.table.data[0].smsId
        this.lastId = this.table.data[this.table.data.length - 1].smsId
      }
      this.oldNum = this.pagination.currentPageNum
    },
    initOptions() {

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

.pagination {
  background: #fff;
  padding: 32px 16px;
  float: right;
}
</style>
