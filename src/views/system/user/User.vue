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
          <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="remove">清除</el-button>
        </el-form-item>
        <el-form-item v-if="AuthUtils.hasAuth('USER_ADD')" label="">
          <router-link to="/system/user/useradd">
            <el-button type="primary" icon="el-icon-circle-plus-outline">新增</el-button>
          </router-link>
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

      <el-table-column label="部门" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>

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

      <el-table-column label="操作" align="center" width="400">
        <template slot-scope="{row}">
          <!-- 0--停用,1--启用 -->
          <el-button v-if="AuthUtils.hasAuth('USER_OPER') && row.userState === 0 && row.id!='1'" size="mini" type="warning" @click="handOn(row)">
            启用
          </el-button>
          <el-button v-if="AuthUtils.hasAuth('USER_OPER') && row.userState === 1 && row.id!='1'" size="mini" type="warning" @click="handOff(row)">
            停用
          </el-button>
          <el-button v-if="AuthUtils.hasAuth('USER_MODIFY') && row.id!='1'" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="AuthUtils.hasAuth('USER_DELETE') && row.id!='1'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button v-if="AuthUtils.hasAuth('USER_OPER') && row.id!='1'" size="mini" type="success" @click="handleReset(row)">
            重置密码
          </el-button>
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
import { fetchList, handOnMethod, handOffMethod, handleDeleteMethod, handleResetMethod } from '@/api/system/user' // 后台接口
import Pagination from '@/components/Pagination'// 分页
export default {
  name: 'User', // 路由名字
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
        value: '-999',
        label: '全部'
      }, {
        value: '1',
        label: '启用'
      }, {
        value: '0',
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
      fetchList(this.listQuery).then(response => {
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
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 1) {
        return 'success-row'
      }
      return ''
    },
    handOn(row) { // 启用
      this.$confirm('确定要启用用户["' + row.username + '"]?', '启用确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handOnMethod({
          userId: row.id
        }).then(response => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '启用成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        })
      })
    },
    handOff(row) { // 停用
      this.$confirm('确定要停用用户["' + row.username + '"]?', '停用确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handOffMethod({
          userId: row.id
        }).then(response => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '停用成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用'
        })
      })
    },
    handleUpdate(row) { // 编辑
      this.$router.push({ path: '/system/user/usermodify', query: { id: row.id }})
    },
    handleDelete(row) { // 删除方法
      this.$confirm('确定要删除用户["' + row.username + '"]?', '删除确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleDeleteMethod({
          userId: row.id
        }).then(response => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleReset(row) { // 重置密码
      this.$confirm('["' + row.username + '"]确定要重置密码?', '重置密码确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleResetMethod({
          userId: row.id
        }).then(response => {
          if (response.success === true) {
            this.$alert('生成的随机6位密码是：' + response.result + '', '生成密码提示', {
              confirmButtonText: '关闭'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
