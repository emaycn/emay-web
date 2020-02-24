<template>
  <div>
    <el-container>
      <el-aside width="18%">
        <el-tree
          ref="orgTree"
          :props="defaultProps"
          lazy
          highlight-current
          accordion
          :load="loadNode"
          node-key="id"
          :default-expanded-keys="[1]"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <div class="filter-container">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="listQuery.search" placeholder="请输入部门名称" style="width:260px" />
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" icon="el-icon-search" @click="searchDep">查询</el-button>
            </el-form-item>
            <el-form-item label>
              <el-button
                class="filter-item"
                type="default"
                icon="el-icon-refresh"
                @click="remove"
              >清除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="AuthUtils.hasAuth('DEPARTMENT_ADD')"
                type="success"
                icon="el-icon-circle-plus-outline"
                @click="departmentAdd"
              >新增部门</el-button>
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
          <el-table-column label="序号" align="center" min-width="10%">
            <template slot-scope="scope">
              <span>{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门名称" align="center" min-width="30%">
            <template slot-scope="scope">
              <span>{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上级部门" align="center" min-width="20%">
            <template>
              <span>{{ add.supdep }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="40%">
            <template slot-scope="{row}">
              <el-button
                v-if="AuthUtils.hasAuth('DEPARTMENT_MODIFY')"
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="编辑"
                circle
                @click="modify(row)"
              />
              <el-button
                v-if="AuthUtils.hasAuth('DEPARTMENT_DELETE')"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除"
                circle
                @click="deleteDep(row)"
              />
              <el-button
                v-if="AuthUtils.hasAuth('DEPARTMENT_VIEW')"
                type="primary"
                size="mini"
                icon="el-icon-view"
                title="查看人员"
                circle
                @click="checkstaff(row)"
              />
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
    <!-- 新增部门弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="570px" top="25vh">
      <el-form
        ref="dataForm"
        v-model="add"
        :model="add"
        label-width="120px"
        style="width: 350px; margin-left:50px;"
        :rules="rules"
      >
        <el-form-item label="部门名称:" props="department">
          <el-input v-model="add.department" />
        </el-form-item>
        <el-form-item label="上级部门:">
          <el-input v-model="add.supdep" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button v-if="showbtn" type="primary" @click="addDep">确定</el-button>
        <el-button v-else type="primary" @click="modifyDep">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { treeLists, treechildrenList, departmentadd, departmentlist, departmentdelete, departmentmodify } from '@/api/system/department'
export default {
  name: 'Department',
  components: {
    Pagination
  },
  data() {
    // 验证部门名称
    var departmentName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('部门名称不能为空'))
      } else if (value.length > 20) {
        callback(new Error('部门名称长度不能超过20'))
      } else {
        callback()
      }
    }
    return {
      node: '',
      resolve: {},
      paginationShow: true,
      totalPage: 1,
      currentPageNum: 1,
      showbtn: '',
      title: '',
      list: null,
      treeList: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      listQuery: {
        search: '',
        start: 0,
        limit: 20
      },
      defaultProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      dialogFormVisible: false,
      add: {
        supdep: '',
        department: '',
        supId: 0,
        parentSupId: ''
      },
      rules: {
        department: [{ required: true, trigger: 'change', validator: departmentName }]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() { // 分页显示
      this.paginationShow = false
      departmentlist({
        id: this.add.supId,
        departmentName: this.listQuery.search,
        start: this.listQuery.start < 0 ? 0 : this.listQuery.start,
        limit: this.listQuery.limit
      }).then(response => {
        if (response.success === true) {
          this.list = response.result.list
          this.total = response.result.totalCount
          this.totalPage = response.result.totalPage
          this.currentPageNum = response.result.currentPageNum
          this.paginationShow = true
          this.listLoading = false
        }
      })
    },
    searchDep() { // 点击查询按钮查询部门
      this.listQuery.start = 0
      this.getList()
    },
    remove() { // 清除查询条件
      this.listQuery = {}
      this.listQuery.search = ''
      this.listQuery.start = 0
      this.listQuery.limit = 20
      this.getList()
    },
    handleNodeClick(data, node) { // 点击每一级部门回调函数
      this.node = node
      this.listLoading = true
      this.add.supdep = data.departmentName // 保存新增上级部门名称  也就是当前点击的
      this.add.supId = data.id // 保存新增上级部门ID
      // 请求子级部门之后在右边表格显示出来
      this.paginationShow = true
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 1) {
        return 'success-row'
      }
      return ''
    },
    departmentAdd() { // 点击新增显示弹窗
      if (this.add.supdep === '') {
        this.dialogFormVisible = false
        this.$message({
          message: '请先选择上级部门',
          type: 'warning'
        })
      } else {
        this.dialogFormVisible = true
        this.title = '新增部门'
        this.showbtn = true
        this.add.department = ''
      }
    },
    addDep() { // 点击新增部门弹窗确定按钮
      departmentadd({ // 新增部门请求
        departmentName: this.add.department,
        parentId: this.add.supId
      }).then(response => {
        if (response.success === true) {
          this.$message({
            message: '新增部门操作成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          setTimeout(() => {
            this.getList()
            this.node.childNodes = []
            this.loadNode(this.node, this.resolve[this.node.id])
          }, 500)
        }
      })
    },
    modifyDep() { // 点击编辑按钮弹窗确定按钮
      departmentmodify({ // 编辑部门请求
        departmentName: this.add.department,
        id: this.add.parentSupId
      }).then(response => {
        if (response.success === true) {
          this.$message({
            message: '修改部门操作成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          setTimeout(() => {
            this.getList()
            this.node.childNodes = []
            this.loadNode(this.node, this.resolve[this.node.id])
          }, 500)
        }
      })
    },
    modify(row) { // 修改部门名称
      this.dialogFormVisible = true
      this.title = '修改部门'
      this.showbtn = false
      this.add.parentSupId = row.id
      this.add.department = row.departmentName
    },
    checkstaff(row) { // 查看部门人员
      this.$router.push({ path: '/system/department/checkstaff', query: { id: row.id, name: row.departmentName }})
    },
    deleteDep(row) { // 删除部门按钮操作
      this.$confirm('确认要删除【' + row.departmentName + '】么?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        departmentdelete({
          id: row.id
        }).then(response => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '删除部门成功!'
            })
            setTimeout(() => {
              this.getList()
              this.loadNode(this.node, this.resolve[this.node.id])
            }, 500)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        })
      })
    },
    // 异步树叶子节点懒加载逻辑
    loadNode(node, resolve) {
      if (this.node === '') {
        this.node = node
      }
      this.resolve[node.id] = resolve
      // 一级节点处理
      if (node.level === 0) {
        this.requestTree(resolve)
      }
      // 其余节点处理
      if (node.level >= 1) {
        // 注意！把resolve传到你自己的异步中去
        this.getIndex(node, resolve)
      }
    },
    // 异步加载叶子节点数据函数
    getIndex(node, resolve) {
      treechildrenList({ // 请求子级部门
        id: node.data.id
      }).then(response => {
        resolve(response.result)
      })
    },
    // 首次加载一级节点数据函数
    requestTree(resolve) {
      treeLists({}).then(response => { // 初始加载请求一级部门树
        resolve(response.result)
        this.defaultProps.label = 'departmentName' // 给一级部门树赋值
        this.add.supdep = response.result[0].departmentName// 初始加载默认显示父级部门
        this.add.supId = response.result[0].id
      })
    }
  }
}
</script>

<style scoped>
.el-aside {
  overflow: hidden;
  background: #f2f2f2;
  margin-bottom: 0;
}
</style>
