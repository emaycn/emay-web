<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名:">
          <el-input v-model="listQuery.username" />
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="listQuery.realname" />
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="listQuery.mobile" />
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="listQuery.userState" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
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
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="序号" width="60" type="index" />
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="部门" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rolename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
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
import { apiList } from '@/api/system/clientUser.js' // 后台接口
import Pagination from '@/components/Pagination'// 分页
export default {
  name: 'ClientUser', // 路由名字
  components: { Pagination }, // 分页模块
  data() {
    return {
      paginationShow: true,
      tableKey: 0,
      list: null,
      total: 0,
      totalPage: '',
      currentPageNum: '',
      listLoading: false,
      username: '', // 用户名
      realname: '', // 姓名
      mobile: '', // 手机号
      options: [{
        value: -1,
        label: '请选择'
      }, {
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '停用'
      }],
      listQuery: {
        start: 0, // 起始数据位置
        limit: 20 // 数据条数
      }
    }
  },
  created() {
    this.getList() // 获取分页信息
  },
  activated() {
    if (this.$route.params.flush === 'on') {
      this.getList() // 获取分页信息
    }
  },
  methods: {
    getList() {
      this.paginationShow = false
      this.listLoading = true
      if (this.listQuery.userState === null || this.listQuery.userState === undefined) {
        this.listQuery.userState = -1
      }
      apiList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.result.list // 获取数据list
        this.total = response.result.totalCount // 记录总条数
        this.totalPage = response.result.totalPage
        this.currentPageNum = response.result.currentPageNum
        this.paginationShow = true
      })
    },
    remove() { // 清除查询条件
      this.listQuery = {}
      this.listQuery.start = 0
      this.listQuery.limit = 20
      this.getList()
    },
    handleFilter() {
      this.listQuery.start = 0
      this.getList()
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
