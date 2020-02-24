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
        <el-form-item label="">
          <el-button v-if="AuthUtils.hasAuth('LOG_ADD')" type="primary" icon="el-icon-upload2" @click="importData">导入</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="AuthUtils.hasAuth('LOG_VIEW')" type="primary" icon="el-icon-download" @click="exportExl">导出</el-button>
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
      <el-table-column label="操作类型" align="center" min-width="15%">
        <template slot-scope="scope">
          <span>{{ coverType(scope.row.operType) }}</span>
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
    <!-- 导入 -->
    <el-dialog title="导入" :visible.sync="dialogFormImportVisible" width="400px">
      <el-form ref="form" :model="form" status-icon>
        <el-row class="red">注：excel第一列为“用户名",第二列为“操作模块,第三列为“内容,第四列为“操作类型”，不需要标题，最大为5M，样例如下：</el-row>
        <el-row class="mb10"> <img :src="exlImg"></el-row>
        <el-row type="flex" justify="center">
          <el-col :span="22">
            <el-form-item label="上传文件:">
              <el-upload
                ref="upload"
                class="upload-demo"
                :file-list="form.fileList"
                action=""
                accept=".xls,.xlsx"
                :on-change="filechange"
                :on-remove="removeFile"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelFile('form')">取消</el-button>
        <el-button size="small" type="primary" @click="importFile('form')">导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { syslog, importMehtod } from '@/api/system/syslog'
import store from '@/store'
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
      },
      // 导入
      exlImg: require('../../../../public/import.png'),
      dialogFormImportVisible: false,
      fileSizeIsSatisfy: true,
      form: {
        fileList: [] // 初始上传的文件
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
      syslog(this.listQuery).then(response => {
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
    // 导入
    importData() {
      this.form.fileList = []
      this.dialogFormImportVisible = true
    },
    /* filechange 判断文件大小 fileList是el-ui 封装的一个文件列表
    onchange事件，会在文件添加得时候去调用filechange方法，做验证
    fileSizeIsSatisfy自定义变量，当上传的文件存在大于5M式，fileSizeIsSatisfy=false,在点击提交时就会提示存在大于5M的文件，不能提交
    **/
    filechange(file, fileList) {
      this.form.fileList = fileList.slice(-1)
      // 限制上传文件为5M
      var sizeIsSatisfy = file.size < 5 * 1024 * 1024
      if (sizeIsSatisfy) {
        return true
      } else {
        this.fileSizeIsSatisfy = false
        return false
      }
    },
    // 上传事件
    importFile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.fileList.length <= 0) {
            this.$message.error('请至少上传一个文件！')
            return
          }
          if (!this.fileSizeIsSatisfy) {
            this.$message.error('上传失败！存在文件大小超过5M！')
            return
          }
          var fd = new FormData()// FormData 对象
          var exlfile
          if (this.form.fileList.length > 0) {
            exlfile = this.form.fileList[0].raw
            fd.append('file', exlfile)// 文件对象
          } else {
            exlfile = ''
          }
          this.listLoading = true
          importMehtod(fd).then(response => {
            this.listLoading = false
            this.dialogFormImportVisible = false
            this.$message({
              message: '导入数据条数: ' + response.result,
              type: 'success'
            })
            this.getList()
          }).catch((error) => {
            this.listLoading = false
            this.$message.error(error)
          })
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    cancelFile(formName) {
      this.form.fileList = []
      this.dialogFormImportVisible = false
    },
    // 文件列表移除文件时的钩子
    removeFile(file, fileList) {
      this.form.fileList = []
    },
    // 导出
    exportExl() {
      this.$confirm('确定要导出数据', '导出确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = this.listQuery
        if (data !== null && data !== undefined) {
          const key = Object.keys(data).filter(name => !(data[name] === null || data[name] === undefined))
          data = encodeURI(key.map(name => `${name}=${data[name]}`).join('&'))
        }
        window.location.href = process.env.VUE_APP_BASE_API + 'userlog/export?' + data + '&AUTH-WEB-TOKEN=' + store.state.webToken.token
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    }
  }
}
</script>
<style scoped>
.filter-container span {
  color: #cccccc;
  font-size: 14px;
}
.red{
  color:red;
  margin-bottom:10px;
}
.mb10{
  margin-bottom:10px;
}
</style>
