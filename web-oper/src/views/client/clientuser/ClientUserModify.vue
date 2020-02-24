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
        <el-input v-model="ruleForm.username" disabled />
      </el-form-item>
      <el-form-item label="姓名：" prop="realname">
        <el-input v-model="ruleForm.realname" maxlength="10" />
      </el-form-item>
      <el-form-item label="所属客户：" prop="clientName">
        <el-input v-model="ruleForm.clientName" disabled />
      </el-form-item>
      <!-- <el-form-item label="变更客户：">
        <el-autocomplete
          v-model="newClientName"
          class="inline-input"
          placeholder="请输入需要变更的客户名称"
          value-key="clientName"
          :fetch-suggestions="searchClient"
          :trigger-on-focus="false"
          :style="{'width': '100%'}"
          @select="handleSelect"
        />
      </el-form-item> -->
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="ruleForm.mobile" />
      </el-form-item>
      <el-form-item label="E-mail：" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="所属角色：" prop="roleIds">
        <el-checkbox-group v-model="favourableForm">
          <el-checkbox v-for="(item) in favourablesSales" :key="item.id" :value="item.id" :label="item.id" name="type">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="btnClicked" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { allRoles } from '@/api/client/role'// 接口
import { handleUpdateMethod, handleUpdateConfirmMethod } from '@/api/client/user'// 接口
import { findByClientName } from '@/api/client/client'// 接口
import { user_name, real_name, phone, userEmail } from '@/utils/Validate' // validate 验证
export default {
  name: 'ClientUserModify',
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
    // var clientIdReg = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请选择所属客户'))
    //   } else {
    //     callback()
    //   }
    // }
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
      if (this.favourableForm.length > 0) {
        callback()
      } else {
        callback(new Error('请至少选择一个所属角色'))
      }
    }
    return {
      btnClicked: false,
      roleTypeSales: '', // 所属系统-销售
      favourableForm: [], // 选中的数据
      favourablesSales: [], // 初始化赋值-销售
      show: false,
      defaultProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      newClientName: '', // 变更客户名称
      newClientId: 0, // 变更客户ID
      ruleForm: {
        username: '',
        realname: '',
        clientId: '',
        clientName: '',
        mobile: '',
        email: '',
        roleIds: []
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: usernameReg }],
        realname: [{ required: true, trigger: 'blur', validator: realnameReg }],
        // clientId: [{ required: true, trigger: 'change', validator: clientIdReg }],
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
          this.roleTypeSales = '销售系统'
          arrSales.push(list[i])
        }
      }
      this.favourablesSales = arrSales
    })
    handleUpdateMethod({// 查看详情
      id: this.$route.query.id
    }).then(response => {
      if (response.success === true) {
        this.ruleForm = response.result.user
        this.ruleForm.clientName = response.result.client.clientName // 所属客户
        this.ruleForm.clientId = response.result.client.id // 所属客户ID
        var choosedRoles = response.result.roleList
        for (let i = 0; i < choosedRoles.length; i++) {
          this.favourableForm.push(choosedRoles[i])
        }
      }
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.newClientId > 0 && this.newClientName) {
          //   // 客户变更
          //   console.log('客户变更前 newClientName=' + this.newClientName + ',newClientId=' + this.newClientId + ',需提交的clientId=' + this.ruleForm.clientId)
          //   this.ruleForm.clientId = this.newClientId
          //   console.log('客户变更后 newClientName=' + this.newClientName + ',newClientId=' + this.newClientId + ',需提交的clientId=' + this.ruleForm.clientId)
          // }
          const roleStrings = this.favourableForm.join(',')
          this.btnClicked = true
          handleUpdateConfirmMethod({
            userId: this.$route.query.id,
            realname: this.ruleForm.realname,
            // clientId: this.ruleForm.clientId,
            mobile: this.ruleForm.mobile,
            email: this.ruleForm.email,
            roleIds: roleStrings
          }).then(response => {
            this.$message({
              message: '修改用户操作成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$store.dispatch('delVisitedView', this.$route)
              this.$router.push({ name: 'ClientUser', params: { flush: 'on' }})
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
    searchClient(queryString, callback) {
      console.log('quertString=' + queryString)
      findByClientName({
        clientName: queryString
      }).then(resp => {
        console.log(resp)
        var clientNameMap = []
        for (const item of resp.result) {
          clientNameMap.push({ 'clientName': item.clientName, 'clientId': item.id })
        }
        callback(clientNameMap) // 调用 callback 返回建议列表的数据
      }).catch(error => {
        this.$message.error(error)
      })
    },
    handleSelect(item, index) {
      console.log('选择了：' + item.clientId)
      this.newClientName = item.clientName
      this.newClientId = item.clientId
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
