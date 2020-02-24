<template>
  <div>
    <el-container>
      <el-main>
        <div class="filter-container">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="客户名称:">
              <el-input v-model="listQuery.clientName" />
            </el-form-item>
            <el-form-item label="联系人:">
              <el-input v-model="listQuery.linkman" />
            </el-form-item>
            <el-form-item label="手机号:">
              <el-input v-model="listQuery.mobile" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchinfo">查询</el-button>
            </el-form-item>
            <el-form-item label>
              <el-button class="filter-item" type="default" icon="el-icon-refresh" @click="remove">清除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="AuthUtils.hasAuth('CLIENT_ADD')"
                type="success"
                icon="el-icon-circle-plus-outline"
                @click="$router.push('/client/add')"
              >新增客户</el-button>
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
          <el-table-column label="联系人" align="center" min-width="7%">
            <template slot-scope="scope">
              <span>{{ scope.row.linkman }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center" min-width="8%">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" align="center" min-width="10%">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址" align="center" min-width="12%">
            <template slot-scope="scope">
              <span>{{ transferText(scope.row.address) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="余额" align="center" min-width="5%">
            <template slot-scope="scope">
              <span>{{ scope.row.balance }}</span>
            </template>
          </el-table-column>
          <el-table-column label="余额预警" align="center" min-width="5%">
            <template slot-scope="scope">
              <span>{{ warningParse(scope.row.isBalanceWarning) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="15%">
            <template slot-scope="{row}">
              <el-button
                v-if="AuthUtils.hasAuth('RECHARGE_CHARGE')"
                size="mini"
                type="success"
                icon="el-icon-plus"
                circle
                title="充值"
                @click="rechargeOper(row)"
              />
              <el-button
                v-if="AuthUtils.hasAuth('RECHARGE_CHARGE')"
                size="mini"
                type="warning"
                icon="el-icon-minus"
                circle
                title="扣费"
                @click="chargeOper(row)"
              />
              <el-button
                v-if="AuthUtils.hasAuth('CLIENT_MODIFY')"
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                title="修改"
                @click="modify(row)"
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
    <!-- 充值 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="充值确认"
      :visible.sync="dialogOperVisible"
      width="580px"
    >
      <el-form
        ref="dataForm"
        v-model="add"
        :model="add"
        label-width="130px"
        style="width: 350px; margin-left:50px;"
        :rules="rules"
      >
        <el-form-item label="客户名称:">
          <!-- <el-input v-model="add.clientName" disabled /> -->
          <span>{{ add.clientName }}</span>
        </el-form-item>
        <el-form-item label="余额（元）:">
          <!-- <el-input v-model="add.balance" disabled /> -->
          <span>{{ add.balance }}</span>
        </el-form-item>
        <el-form-item label="充值金额（元）:" prop="changeBalance">
          <el-input v-model="add.changeBalance " />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="add.remark"
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            maxlength="50"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelSubmit('dataForm')">取消</el-button>
        <el-button size="small" type="primary" :disabled="dialogBtnClicked" @click="rechargeSubmit('dataForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 扣费 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="扣费确认"
      :visible.sync="dialogOpersVisible"
      width="580px"
    >
      <el-form
        ref="dataForms"
        v-model="addcharge"
        :model="addcharge"
        label-width="130px"
        style="width: 350px; margin-left:50px;"
        :rules="rules"
      >
        <el-form-item label="客户名称:">
          <!-- <el-input v-model="addcharge.clientName" disabled /> -->
          <span>{{ addcharge.clientName }}</span>
        </el-form-item>
        <el-form-item label="余额（元）:">
          <!-- <el-input v-model="addcharge.balance" disabled /> -->
          <span>{{ addcharge.balance }}</span>
        </el-form-item>
        <el-form-item label="扣费金额（元）:" prop="changeBalance">
          <el-input v-model="addcharge.changeBalance" />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="addcharge.remark"
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            maxlength="50"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelChargeSubmit('dataForms')">取消</el-button>
        <el-button size="small" type="primary" :disabled="dialogBtnClicked" @click="chargeSubmit('dataForms')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { clientList, rechargeMethod, chargeMethod } from '@/api/client/client'
import { pricemodify } from '@/utils/Validate'
export default {
  name: 'Client',
  components: {
    Pagination
  },
  data() {
    // 表单验证规则 充值扣费金额
    var redeReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('金额不能为空'))
      } else if (!pricemodify(value)) {
        callback(new Error('单价格式为00.0000'))
      } else {
        callback()
      }
    }
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
      },
      dialogBtnClicked: false,
      dialogOperVisible: false,
      add: {
        id: '',
        clientName: '',
        balance: '',
        changeBalance: '',
        remark: ''
      },
      dialogOpersVisible: false,
      addcharge: {
        id: '',
        clientName: '',
        balance: '',
        changeBalance: '',
        remark: ''
      },
      rules: {
        changeBalance: [{ required: true, trigger: 'blur', validator: redeReg }]
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
    getList() { // 分页显示
      this.paginationShow = false
      this.listLoading = true
      clientList(this.listQuery // 初始加载显示分页客户信息
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
    searchinfo() { // 查询
      this.listQuery.start = 0
      this.getList()
    },
    remove() { // 清除查询条件
      this.listQuery = {}
      this.listQuery.start = 0
      this.listQuery.limit = 20
      this.getList()
    },
    modify(row) { // 修改客户信息
      this.$router.push({ path: '/client/modify', query: { id: row.id }})
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 1) {
        return 'success-row'
      }
      return ''
    },
    // 充值
    rechargeOper(row) {
      this.dialogOperVisible = true
      this.dialogBtnClicked = false
      this.showbtn = false
      this.add.id = row.id
      this.add.clientName = row.clientName
      this.add.balance = row.balance
    },
    rechargeSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogBtnClicked = true
          rechargeMethod({
            changeBalance: this.add.changeBalance,
            remark: this.add.remark,
            id: this.add.id
          }).then(response => {
            if (response.success === true) {
              this.$message({
                message: '充值成功',
                type: 'success'
              })
              this.dialogOperVisible = false
              setTimeout(() => {
                this.getList()
                this.$refs[formName].resetFields()
                this.add.changeBalance = ''
                this.add.remark = ''
                this.add.id = ''
              }, 500)
            }
          }).catch(error => {
            this.dialogBtnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    // 扣费
    chargeOper(row) {
      this.dialogOpersVisible = true
      this.dialogBtnClicked = false
      this.addcharge.id = row.id
      this.addcharge.clientName = row.clientName
      this.addcharge.balance = row.balance
    },
    chargeSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogBtnClicked = true
          chargeMethod({
            changeBalance: this.addcharge.changeBalance,
            remark: this.addcharge.remark,
            id: this.addcharge.id
          }).then(response => {
            if (response.success === true) {
              this.$message({
                message: '扣费成功',
                type: 'success'
              })
              this.dialogOpersVisible = false
              setTimeout(() => {
                this.getList()
                this.$refs[formName].resetFields()
                this.addcharge.changeBalance = ''
                this.addcharge.remark = ''
                this.addcharge.id = ''
              }, 500)
            }
          }).catch(error => {
            this.dialogBtnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    cancelSubmit(formName) {
      this.dialogOperVisible = false
      this.add.remark = ''
      this.$refs[formName].resetFields()
    },
    cancelChargeSubmit(formName) {
      this.dialogOpersVisible = false
      this.addcharge.remark = ''
      this.$refs[formName].resetFields()
    },
    warningParse(isBalanceWarning) {
      if (isBalanceWarning === false) {
        return '关闭'
      } else {
        return '开启'
      }
    }
  }
}
</script>

<style>
</style>
