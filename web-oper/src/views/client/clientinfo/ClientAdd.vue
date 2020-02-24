<template>
  <div>
    <el-form
      v-if="ruleForm!=null"
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      size="mini"
      class="ruleForm"
    >
      <el-form-item label="客户名称：" prop="clientName">
        <el-input v-model="ruleForm.clientName" />
      </el-form-item>
      <el-form-item label="联系人：" prop="linkman">
        <el-input v-model="ruleForm.linkman" />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="ruleForm.mobile" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="余额预警：" prop="isBalanceWarning">
        <el-checkbox v-model="ruleForm.isBalanceWarning" />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="ruleForm.address" type="textarea" style="resize:none" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="btnClicked" @click="modify('ruleForm')">确定</el-button>
        <el-button @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { cemail, clinkman, cmobile } from '@/utils/Validate' // validate 验证
import { clientAdd } from '@/api/client/client'
export default {
  name: 'ClientAdd',
  data() {
    var nameCnReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('客户名称不能为空'))
      } else if (value.length > 50) {
        callback(new Error('客户名称超过长度限制'))
      } else {
        callback()
      }
    }
    var linkmanReg = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!clinkman(value)) {
        callback(new Error('联系人格式错误'))
      } else {
        callback()
      }
    }
    var mobileReg = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!cmobile(value)) {
        callback(new Error('请输入正确格式的手机号'))
      } else {
        callback()
      }
    }
    var emailReg = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!cemail(value)) {
        callback(new Error('请输入正确格式的邮箱号'))
      } else {
        callback()
      }
    }
    var remarkReg = (rule, value, callback) => {
      if (value.length > 100) {
        callback(new Error('地址长度超过限制'))
      } else {
        callback()
      }
    }
    return {
      btnClicked: false,
      ruleForm: {
        clientName: '',
        linkman: '',
        mobile: '',
        address: '',
        email: '',
        isBalanceWarning: true
      },
      listLoading: false,
      rules: {
        clientName: [{ required: true, trigger: 'blur', validator: nameCnReg }],
        linkman: [{ required: true, trigger: 'blur', validator: linkmanReg }],
        mobile: [{ required: true, trigger: 'blur', validator: mobileReg }],
        email: [{ required: true, trigger: 'blur', validator: emailReg }],
        address: [{ required: false, trigger: 'blur', validator: remarkReg }]
      }
    }
  },
  created() {

  },
  methods: {
    modify(formName) { // 修改客户信息
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnClicked = true
          clientAdd(this.ruleForm).then(response => {
            this.$message({
              message: '新增客户成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$store.dispatch('delVisitedView', this.$route)
              this.$router.push({ name: 'Client', params: { flush: 'on' }})
            }, 500)
          }).catch(error => {
            this.btnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
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

<style scoped>
.ruleForm {
  width: 500px;
  margin:10% auto;
}
span {
  color: rgb(49, 47, 47);
}
.el-textarea {
  resize: none;
}
.dialog-footer{
  margin-top: 10vh;
}
</style>
