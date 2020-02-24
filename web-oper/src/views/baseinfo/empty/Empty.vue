<template>
  <div class="app-container">
    <!-- 数据查询|按钮操作 -->
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="手机号:">
          <el-input v-model="queryParams.mobile" :maxlength="11" />
        </el-form-item>
        <el-form-item label>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="methodSearch"
          >查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            class="filter-item"
            type="default"
            icon="el-icon-refresh"
            @click="cleanQueryParams"
          >清除</el-button>
        </el-form-item>
        <el-form-item v-if="AuthUtils.hasAuth('EMPTY_ADD')" label>
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="addFromOpen()">新增</el-button>
        </el-form-item>
        <el-form-item v-if="AuthUtils.hasAuth('EMPTY_VIEW')" label>
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="downloadExcelTemplate()"
          >下载EXCEL模版</el-button>
        </el-form-item>
        <!-- <el-form-item v-if="AuthUtils.hasAuth('EMPTY_ADD')" label="">
          <el-button type="warning" icon="el-icon-download" @click="exportExcel()">导出EXCEL</el-button>
        </el-form-item>-->
        <el-form-item v-if="AuthUtils.hasAuth('EMPTY_IMPORT')" label>
          <el-button type="danger" icon="el-icon-upload" @click="fileUploadFormOpen()">导入EXCEL</el-button>
        </el-form-item>
        <!-- <el-form-item v-if="AuthUtils.hasAuth('EMPTY_ADD')" label="">
          <el-button type="default" icon="el-icon-download" @click="uploadExcel()">上传EXCEL</el-button>
        </el-form-item>-->
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
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button
            v-if="AuthUtils.hasAuth('EMPTY_DELETE') && row.id!='1'"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            title="删除"
            circle
            @click="methodDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      v-if="paginationShow"
      class="pagination"
      :total="total"
      :total-page="totalPage"
      :page="currentPageNum"
      :start.sync="queryParams.start"
      :limit.sync="queryParams.limit"
      @pagination="methodGetList"
    />

    <!-- 添加Dialog -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加空号，逗号隔开"
      :visible.sync="addDialogShow"
      width="600px"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="formRules"
        label-width="80px"
        size="mini"
        class="addForm"
        style="width: 500px; margin-left:20px;"
      >
        <el-form-item label="手机号:" prop="mobiles">
          <el-input
            v-model="addForm.mobiles"
            type="textarea"
            :rows="10"
            placeholder="请输入手机号，多个以逗号隔开"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addFormCancel('addForm')">取消</el-button>
        <el-button size="small" type="primary" :disabled="dialogBtnClicked" @click="addFormSubmit('addForm')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 文件上传Dialog -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="导入文件"
      :visible.sync="fileUploadDialogShow"
      width="580px"
    >
      <el-form
        ref="fileUploadForm"
        :model="fileUploadForm"
        :rules="formRules"
        label-width="130px"
        size="mini"
        class="fileUploadForm"
        style="width: 350px; margin-left:50px;"
      >
        <el-form-item label="请选择文件">
          <!-- 上传文件 -->
          <el-upload
            ref="upload"
            class="upload-demo"
            action
            accept=".xls, .xlsx"
            :on-change="addFile"
            :on-remove="removeFile"
            :auto-upload="false"
            :file-list="fileUploadForm.fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件，大小不超过20M！</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="fileUploadFormCancel('fileUploadForm')">取消</el-button>
        <el-button size="small" type="primary" :disabled="dialogBtnClicked" @click="fileUploadFormSubmit('fileUploadForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { phone } from '@/utils/Validate' // validate 验证
import { apiList, apiDelete, apiAdd } from '@/api/baseinfo/empty.js' // 后台接口
import { apiEmptyImport } from '@/api/public/upload.js' // 文件上传接口
import Pagination from '@/components/Pagination' // 分页
export default {
  name: 'Empty', // 组件名称
  components: { Pagination }, // 引用的组件
  data() {
    // 数据
    // 空号验证
    var mobilesReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length <= 11 && !phone(value)) {
        callback(new Error('手机号格式错误'))
      } else if (value.length > 11) { // 多号码
        const reg = /，/g
        const newValue = value.replace(reg, ',')
        const arr = newValue.split(',')
        var ok = true
        for (var str of arr) {
          if (!phone(str)) {
            callback(new Error('手机号格式错误：' + str))
            ok = false
            break
          }
        }
        if (ok) {
          this.addForm.mobiles = newValue
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      dialogBtnClicked: false,
      addDialogShow: false,
      fileUploadDialogShow: false,
      // 查询参数
      queryParams: {
        mobile: '', // 手机号
        start: 0, // 起始数据位置
        limit: 20 // 数据条数
      },
      // 添加表单
      addForm: {
        mobiles: ''
      },
      // 文件上传表单
      fileUploadForm: {
        fileList: []
      },
      overFileMaxSize: false, // 文件大小超出限制
      // 表单验证规则
      formRules: {
        mobiles: [{ required: true, trigger: 'blur', validator: mobilesReg }]
      },
      // 分页参数
      paginationShow: true,
      total: 0, // 分页-总条数
      totalPage: '', // 分页-总页数
      currentPageNum: '', // 分页-当前页码
      // 列表数据
      tableKey: 0,
      tableData: null,
      tableDataLoading: false // table数据加载中...
      // 其他数据
      // 下拉选项数据
    }
  },
  created() {
    // console.log('1=created')
    this.methodGetList() // 获取表格数据
  },
  mounted() {
    // console.log('2=mounted')
  },
  activated() {
    // console.log('3=activated')
    if (this.$route.params.flush === 'on') {
      this.methodGetList() // 获取表格数据
    }
  },
  updated() {
    // console.log('4=updated')
  },
  methods: {
    methodGetList() {
      // 获取表格数据
      this.paginationShow = false // 关闭分页
      this.tableDataLoading = true // 打开loading...
      apiList(this.queryParams).then(response => {
        this.tableData = response.result.list // 给tableData赋值
        this.total = response.result.totalCount // 总条数
        this.totalPage = response.result.totalPage // 总页数
        this.currentPageNum = response.result.currentPageNum // 当前页码
        this.tableDataLoading = false // 关闭loading...
        this.paginationShow = true // 显示分页
      })
    },
    methodSearch() {
      // 查询
      this.queryParams.start = 0
      this.methodGetList()
    },
    methodDelete(row) {
      // 删除方法
      this.$confirm('确定要删除号码["' + row.mobile + '"]?', '删除确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apiDelete({
            id: row.id
          }).then(response => {
            if (response.success === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.methodGetList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除操作'
          })
        })
    },
    cleanQueryParams() {
      // 清除查询条件
      this.queryParams.mobile = ''
      this.queryParams.start = 0
      this.queryParams.limit = 20
      this.methodGetList()
    },
    // 添加
    addFromOpen() {
      this.addDialogShow = true
      this.dialogBtnClicked = false
    },
    addFormCancel(formName) {
      this.addDialogShow = false
      this.addForm.mobiles = ''
    },
    addFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogBtnClicked = true
          apiAdd(this.addForm)
            .then(response => {
              this.$message({
                message: '添加空号操作成功',
                type: 'success'
              })
              setTimeout(() => {
                this.addFormCancel()
                this.methodGetList()
              }, 500)
            })
            .catch(error => {
              this.dialogBtnClicked = false
              this.$message.error(error)
            })
        } else {
          return false
        }
      })
    },
    // 文件上传
    fileUploadFormOpen() {
      this.fileUploadDialogShow = true
      this.dialogBtnClicked = false
      this.fileUploadForm.fileList = []
    },
    fileUploadFormCancel(formName) {
      this.fileUploadDialogShow = false
    },
    fileUploadFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.fileUploadForm.fileList.length <= 0) {
            this.$message.error('请选择一个文件！')
            return
          }
          if (this.overFileMaxSize) {
            this.$message.error('上传失败，文件超过20M！')
            return
          }
          var formData = new FormData() // FormData 对象
          if (this.fileUploadForm.fileList.length > 0) {
            var tmpfile = this.fileUploadForm.fileList[0].raw
            formData.append('file', tmpfile) // 文件对象
          }
          this.dialogBtnClicked = true
          apiEmptyImport(formData)
            .then(response => {
              this.$message({
                message: '上传成功',
                type: 'success'
              })
              setTimeout(() => {
                this.fileUploadFormCancel()
                this.methodGetList()
              }, 500)
            })
            .catch(error => {
              this.dialogBtnClicked = false
              this.$message.error(error)
            })
        } else {
          return false
        }
      })
    },
    // 上传文件操作
    addFile(file, fileList) {
      this.fileUploadForm.fileList = fileList.slice(-1)
      // 限制上传文件为20M
      var fileSize = file.size < 20 * 1024 * 1024
      if (fileSize) {
        return true
      } else {
        this.overFileMaxSize = true
        return false
      }
    },
    removeFile(file, fileList) {
      this.fileUploadForm.fileList = []
    },
    downloadExcelTemplate() {
      // 下载Excel模版
      import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['手机号']
        const tKey = ['mobile']
        const templateData = [{ mobile: '18888888888' }]
        const data = this.formatExcelData(tKey, templateData)
        excel.export_json_to_excel({
          header: tHeader, // Header Required
          data, // Specific data Required
          filename: '空号', // Optional
          autoWidth: true, // Optional
          bookType: 'xlsx' // Optional
        })
      })
    },
    exportExcel() {
      // 导出Excel
      import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['序号', '手机号']
        const filterVal = ['id', 'mobile']
        const list = this.tableData
        const data = this.formatExcelData(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader, // Header Required
          data, // Specific data Required
          filename: 'export-empty', // Optional
          autoWidth: true, // Optional
          bookType: 'xlsx' // Optional
        })
      })
    },
    formatExcelData(filterVal, jsonData) {
      // 格式化Excel数据
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return '日期格式化'
          } else if (j === 'isDelete') {
            return '已删除'
          } else {
            return v[j]
          }
        })
      )
    },
    uploadExcel() {
      // 上传文件并展示
      this.$store.dispatch('delVisitedView', this.$route)
      this.$router.push({ name: 'UploadExcel', params: { flush: 'on' }})
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
