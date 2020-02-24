<template>
  <div class="changepass app-container">
    <h1>{{ getMsg() }}</h1>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="150px"
      class="ruleForm"
    >
      <el-form-item label="原密码：" prop="originalPass">
        <el-input v-model="ruleForm.originalPass" type="password" />
      </el-form-item>
      <el-form-item label="新密码：" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item size="medium">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { validPassword } from '@/utils/Validate'
import { changepassword } from '@/api/public/changepass'// 接口
import { logOut } from '@/api/public/logout'// 接口
export default {
  name: 'Changepass',
  data() {
    var validatePass0 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('原密码不能为空'))
      } else if (!validPassword(value)) {
        callback(new Error('格式错误，密码由6－16位数字英文组成'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('新密码不能为空'))
      } else if (!validPassword(value)) {
        callback(new Error('格式错误，密码由6－16位数字英文组成'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('再次确认密码不能为空'))
      } else if (!validPassword(value)) {
        callback(new Error('格式错误，密码由6－16位数字英文组成'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        originalPass: ''
      },
      rules: {
        pass: [{ required: true, trigger: 'blur', validator: validatePass }],
        checkPass: [
          { required: true, trigger: 'blur', validator: validatePass2 }
        ],
        originalPass: [
          { required: true, trigger: 'blur', validator: validatePass0 }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          changepassword({
            password: this.ruleForm.originalPass,
            newpass: this.ruleForm.checkPass
          })
            .then(response => {
              this.$message({
                message: '密码修改成功，请重新登录',
                type: 'success'
              })
              logOut().then(response => {
                this.dologout()
              }).catch(error => {
                console.log(error)
                this.dologout()
              })
            })
            .catch(error => {
              this.$message.error(error)
            })
        } else {
          return false
        }
      })
    },
    dologout() {
      this.$store.commit('LOGOUT')
      this.$store.commit('DELETE_ALL_ROUTES')
      this.$store.dispatch('delVisitedView', this.$route)
      this.SessionStorageUtils.setStore()
      this.$router.push(`/login`)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$store.dispatch('delVisitedView', this.$route)
      this.$router.push('/')
    },
    getMsg() {
      return this.$route.query.msg
    }
  }
}
</script>

<style scoped>
.changepass {
     width: 100%;
  margin:10% auto;
}
.changepass h1{
  text-align:center;
  margin:0;
  padding:0;
}
.ruleForm {
  width: 700px;
  margin:60px auto;
}
span {
  color: rgb(49, 47, 47);
}
</style>
