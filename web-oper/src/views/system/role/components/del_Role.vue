<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="角色名称:">
          <el-input v-model="listQuery.roleName" />
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-form-item>
        <el-form-item v-if="AuthUtils.hasAuth('ROLE_ADD')" label="">
          <router-link :to="{path: '/system/role/roleadd', query: { roleType:roleType}}">
            <el-button type="primary" icon="el-icon-circle-plus-outline">添加角色</el-button>
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
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template slot-scope="{row}">
          <el-button v-if="AuthUtils.hasAuth('ROLE_MODIFY') && row.id !=1" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="AuthUtils.hasAuth('ROLE_DELETE') && row.id !=1" size="mini" type="danger" @click="handleDelete(row)">
            删除
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
import { fetchList, handleDeleteMethod } from '@/api/system/role' // 后台接口
import Pagination from '@/components/Pagination' // 分页
export default {
  components: { Pagination }, // 分页模块
  props: {
    roleType: {
      type: String,
      default: 'OPER'
    }
  },
  data() {
    return {
      paginationShow: true,
      tableKey: 0,
      list: null,
      total: 0,
      roleName: '', // 角色名称
      totalPage: '',
      currentPageNum: '',
      listLoading: false,
      listQuery: {
        roleType: this.roleType,
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
    handleUpdate(row) { // 编辑
      this.$router.push({ path: '/system/role/rolemodify', query: { roleId: row.id, roleName: row.roleName, remark: row.remark, roleType: row.roleType }})
    },
    handleDelete(row) { // 删除方法
      this.$confirm('确定要删除角色["' + row.roleName + '"]?', '删除确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleDeleteMethod({
          roleId: row.id
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
    }
  }
}
</script>

<style>
</style>
