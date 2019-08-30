<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="info" placeholder="搜索用户名、姓名、手机号" style="width:260px" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="remove">清除</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-exit" @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">返回</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline">
        <h3>部门名称：{{ depName }}</h3>
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
      <el-table-column label="用户名" align="center" min-width="15%">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.rolename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="20%">
        <template slot-scope="scope">
          <span>{{ coverState(scope.row.userState) }}</span>
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
import { departmentchildlist } from '@/api/system/user'
export default {
  name: 'Checkstaff',
  components: {
    Pagination
  },
  data() {
    return {
      depName: '',
      paginationShow: true,
      tableKey: 0,
      list: null,
      total: 0,
      info: '',
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
    this.depName = this.$route.query.name
  },
  methods: {
    getList() {
      this.paginationShow = false
      this.listLoading = true
      departmentchildlist({
        deptId: this.$route.query.id,
        start: this.listQuery.start,
        limit: this.listQuery.limit,
        variableName: this.info
      }).then(response => {
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
      this.info = ''
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 1) {
        return 'success-row'
      }
      return ''
    },
    coverState(userState) {
      if (userState === 1) {
        return '启用'
      } else {
        return '停用'
      }
    }
  }
}
</script>
<style>
</style>
