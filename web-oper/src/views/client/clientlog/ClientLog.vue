<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="操作用户:">
          <el-input v-model="listQuery.username" />
        </el-form-item>
        <el-form-item label="操作用户姓名:">
          <el-input v-model="listQuery.realname" />
        </el-form-item>
        <el-form-item label="开始时间:">
          <el-date-picker
            v-model="listQuery.startDate"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptionsStart"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item label="结束时间:">
          <el-date-picker
            v-model="listQuery.endDate"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptionsEnd"
            default-time="23:59:59"
          />
        </el-form-item>
        <el-form-item label="内容:">
          <el-input v-model="listQuery.content" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="default" icon="el-icon-refresh" @click="remove">清除</el-button>
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
      <!-- <el-table-column label="操作系统" align="center" min-width="15%">
        <template slot-scope="scope">
          <span>{{ coverLogFor(scope.row.logFor) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="服务模块" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" align="center" min-width="15%">
        <template slot-scope="scope">
          <span :class="coverClass(scope.row.operType)">{{ coverType(scope.row.operType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作用户" align="center" min-width="15%">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作用户姓名" align="center" min-width="15%">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
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
import { clientlog } from '@/api/client/log'
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
      totalPage: '',
      currentPageNum: '',
      listLoading: false,
      listQuery: {
        start: 0,
        limit: 20
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.listQuery.endDate) {
            return time.getTime() >= new Date(this.listQuery.endDate).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.listQuery.startDate) {
            return time.getTime() <= new Date(this.listQuery.startDate).getTime()
          }
        }
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
      clientlog(this.listQuery).then(response => {
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
    },
    coverType(type) {
      if (type === 'ADD') {
        return '新增'
      } else if (type === 'SELECT') {
        return '查询'
      } else if (type === 'MODIFY') {
        return '修改'
      } else if (type === 'DELETE') {
        return '删除'
      } else {
        return '其他'
      }
    },
    coverClass(type) {
      if (type === 'ADD') {
        return 'green'
      } else if (type === 'SELECT') {
        return 'black'
      } else if (type === 'MODIFY') {
        return 'blue'
      } else if (type === 'DELETE') {
        return 'red'
      } else {
        return '其他'
      }
    }
  }
}
</script>
<style scoped>
.filter-container span {
  color: #cccccc;
  font-size: 14px;
}
.blue {
  color:blue;
}
.red {
  color:red;
}
.black {
  color:black;
}
.green {
  color:green;
}
</style>
