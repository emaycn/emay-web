<template>
  <div>
    <el-container>
      <el-main>
        <div class="filter-container">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="客户名称:">
              <el-input v-model="listQuery.clientName" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchinfo">查询</el-button>
            </el-form-item>
            <el-form-item label>
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
          <el-table-column label="客户名称" align="center" min-width="10%">
            <template slot-scope="scope">
              <span>{{ scope.row.clientName }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="充值类型" align="center" min-width="7%">
            <template slot-scope="scope">
              <span>{{ scope.row.chargeType }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="金额" align="center" min-width="8%">
            <template slot-scope="scope">
              <span v-if="scope.row.chargeType==1" class="red">+{{ scope.row.charge }}</span>
              <span v-else class="green">{{ scope.row.charge }}</span>
            </template>
          </el-table-column>
          <el-table-column label="充值时间" align="center" min-width="10%">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" min-width="10%">
            <template slot-scope="scope">
              <span>{{ scope.row.chargeUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" min-width="10%">
            <template slot-scope="scope">
              <span>{{ transferText(scope.row.remark) }}</span>
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
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { chargeList } from '@/api/client/charge'
export default {
  name: 'ChargeIndex',
  components: {
    Pagination
  },
  data() {
    return {
      paginationShow: true,
      totalPage: '',
      currentPageNum: '',
      list: null,
      total: 0,
      tableKey: 0,
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
  activated() {
    if (this.$route.params.flush === 'on') {
      this.getList() // 获取分页信息
    }
  },
  methods: {
    getList() {
      // 分页显示
      this.paginationShow = false
      this.listLoading = true
      chargeList(
        this.listQuery // 初始加载显示分页充值明细信息
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
    searchinfo() {
      // 查询
      this.listQuery.start = 0
      this.listQuery.limit = 20
      this.getList()
    },
    remove() {
      // 清除查询条件
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
<style>
.red {
  color:red;
}
.green {
  color:green;
}
</style>
