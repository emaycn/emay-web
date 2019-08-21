<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="操作用户:">
          <el-input v-model="listQuery.username" />
        </el-form-item>
        <el-form-item label="开始时间:">
          <el-date-picker
            v-model="listQuery.startDate"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间:">
          <el-date-picker
            v-model="listQuery.endDate"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="内容:">
          <el-input v-model="listQuery.content" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="remove">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="序号" align="center" min-width="5%">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作内容" align="center" min-width="25%">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务模块" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能模块" align="center" min-width="15%">
        <template slot-scope="scope">
          <span>{{ scope.row.operType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作用户" align="center" min-width="15%">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.operTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      v-if="paginationShow"
      class="pagination"
      :total="total"
      :total-page="totalPage"
      :page="currentPageNum"
      :start.sync="listQuery.start"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { syslog } from '@/api/system/syslog'
export default {
  name: 'Log',
  components: {
    Pagination
  },
  data() {
    return {
      paginationShow: true,
      tableKey: 0,
      list: null,
      total: 0,
      datatime1: '',
      datatime2: '',
      content: '',
      date: '',
      username: '',
      totalPage: '',
      currentPageNum: '',
      listLoading: false,
      listQuery: {
        start: 0,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.paginationShow = false
      this.listLoading = true
      syslog(this.listQuery
      ).then(response => {
        if (response.success === true) {
          this.listLoading = false
          this.list = response.result.list
          this.total = response.result.totalCount
          this.totalPage = response.result.totalPage
          this.currentPageNum = response.result.currentPageNum
          this.paginationShow = true
        }
      })
    },
    search() {
      this.listQuery.start = 0
      this.getList()
    },
    remove() { // 清除查询条件
      this.listQuery = {}
      this.listQuery.start = 0
      this.listQuery.limit = 20
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 1) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>
<style scoped>
.filter-container span {
  color: #cccccc;
  font-size: 14px;
}

</style>
