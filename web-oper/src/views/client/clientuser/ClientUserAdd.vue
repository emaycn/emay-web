<template>
  <div class="useradd app-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      size="mini"
      class="ruleForm"
    >
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="姓名：" prop="realname">
        <el-input v-model="ruleForm.realname" maxlength="10" />
      </el-form-item>
      <el-form-item label="所属客户：" prop="clientId">
        <el-autocomplete
          v-model="ruleForm.clientName"
          class="inline-input"
          placeholder="请输入客户名称"
          :fetch-suggestions="searchClient"
          :trigger-on-focus="false"
          :style="{'width': '100%'}"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="ruleForm.mobile" />
      </el-form-item>
      <el-form-item label="E-mail：" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="所属角色：" prop="roleIds">
        <el-checkbox-group v-model="ruleForm.roleIds">
          <el-checkbox v-for="item in ruleForm.alongRolesSales" :key="item.key" :label="item.id">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="btnClicked" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="创建用户提示"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
    >
      <span>用户{{ ruleForm.username }}已经创建，密码为：{{ mmdata }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createMM">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { allRoles } from '@/api/client/role'// 接口
import { addConfirm } from '@/api/client/user'// 接口
import { findByClientName } from '@/api/client/client'// 接口
import { user_name, real_name, phone, userEmail } from '@/utils/Validate' // validate 验证
export default {
  name: 'ClientUserAdd',
  data() {
    // 表单验证规则 用户名
    var usernameReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else if (!user_name(value)) {
        callback(new Error('请输入4-16位英文字母和数字，首位不能为数字'))
      } else {
        callback()
      }
    }
    // 姓名
    var realnameReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('姓名不能为空'))
      } else if (!real_name(value)) {
        callback(new Error('请输入中文和英文'))
      } else {
        callback()
      }
    }
    // 所属客户
    var clientIdReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择所属客户'))
      } else {
        callback()
      }
    }
    // 手机号
    var mobileReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!phone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    // 邮箱
    var emailReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱不能为空'))
      } else if (!userEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    // 所属角色
    var roleIdReg = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请至少选择一个所属角色'))
      } else {
        callback()
      }
    }
    return {
      btnClicked: false,
      show: false,
      btn: false,
      mmdata: '',
      defaultProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      ruleForm: {
        roleTypeSales: '', // 所属系统-销售
        alongRolesSales: [], // 销售端端所属角色
        username: '',
        realname: '',
        clientId: '',
        clientName: '',
        mobile: '',
        email: '',
        roleIds: []
      },
      dialogVisible: false,
      rules: {
        username: [{ required: true, trigger: 'blur', validator: usernameReg }],
        realname: [{ required: true, trigger: 'blur', validator: realnameReg }],
        clientId: [{ required: true, trigger: 'change', validator: clientIdReg }],
        mobile: [{ required: true, trigger: 'blur', validator: mobileReg }],
        email: [{ required: true, trigger: 'blur', validator: emailReg }],
        roleIds: [{ required: true, trigger: 'change', validator: roleIdReg }]
      }
    }
  },
  created() {
    allRoles({}).then(response => { // 初始加载所属角色
      const list = response.result
      const arrSales = []
      for (var i = 0; i < list.length; i++) {
        if (list[i].roleType === 'CLIENT') {
          this.ruleForm.roleTypeSales = '销售系统'
          arrSales.push(list[i])
        }
      }
      this.ruleForm.alongRolesSales = arrSales
    })
  },
  methods: {
    createMM() {
      setTimeout(() => {
        this.$store.dispatch('delVisitedView', this.$route)
        this.$router.push({ name: 'ClientUser', params: { flush: 'on' }})
      }, 500)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const roleStrings = this.ruleForm.roleIds.join(',')
          this.btnClicked = true
          addConfirm({
            username: this.ruleForm.username,
            realname: this.ruleForm.realname,
            clientId: this.ruleForm.clientId,
            mobile: this.ruleForm.mobile,
            email: this.ruleForm.email,
            roleIds: roleStrings
          }).then(response => {
            if (response.success === true) {
              // 显示模态框
              this.dialogVisible = true
              this.mmdata = response.result
            }
          }).catch(error => {
            this.btnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    searchClient(queryString, callback) {
      console.log('quertString=' + queryString)
      findByClientName({
        clientName: queryString
      }).then(resp => {
        console.log(resp)
        var clientNameMap = []
        for (const item of resp.result) {
          clientNameMap.push({ 'value': item.clientName, 'address': item.id })
        }
        callback(clientNameMap) // 调用 callback 返回建议列表的数据
      }).catch(error => {
        this.$message.error(error)
      })
    },
    handleSelect(item, index) {
      console.log('选择了：' + item.address)
      this.ruleForm.clientId = item.address
      this.ruleForm.clientName = item.value
    }
  }
}
</script>

<style scoped>
.ruleForm {
  width: 500px;
  margin:10% auto;
}
span {
  color: rgb(49, 47, 47);
}
.tree{
  max-height:200px;
  overflow-y: auto;
  border-bottom:1px solid #dfe4ed;
  border-left:1px solid #dfe4ed;
  border-right:1px solid #dfe4ed;
}
</style>
