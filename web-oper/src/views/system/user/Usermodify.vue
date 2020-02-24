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
      <el-form-item label="所属部门：" prop="departmentId">
        <el-input v-model="ruleForm.departmentName" readonly>
          <el-button slot="append" icon="el-icon-arrow-down" @click="isShowTree" />
        </el-input>
        <div class="tree">
          <el-tree
            v-if="show"
            ref="orgTree"
            :props="defaultProps"
            lazy
            highlight-current
            accordion
            :load="loadNode"
            node-key="id"
            style="border:1px solid #dfe4ed;"
            @node-click="handleNodeClick"
          />
          <el-button v-show="btn" type="primary" style="width:100px;margin:1% 35%;" @click="btnshow">确定</el-button>
        </div>
      </el-form-item>

      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="ruleForm.mobile" />
      </el-form-item>

      <el-form-item label="E-mail：" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>

      <el-form-item label="所属角色：" prop="roleIds">
        <el-checkbox-group v-model="favourableForm">
          <el-checkbox v-for="(item) in favourables" :key="item.id" :value="item.id" :label="item.id" name="type">{{ item.roleName }}</el-checkbox>
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
import { alongRoles } from '@/api/system/role'// 接口
import { handleUpdateMethod, handleUpdateConfirmMethod } from '@/api/system/user'// 接口
import { treeLists, treechildrenList } from '@/api/system/department'// 接口
import { user_name, real_name, phone, userEmail } from '@/utils/Validate' // validate 验证
export default {
  name: 'Usermodify',
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
    // 用户类型
    var userTypeReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择用户类型'))
      } else {
        callback()
      }
    }
    // 所属部门
    var departmentIdReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择所属部门'))
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
      if (this.favourableForm.length > 0) {
        callback()
      } else {
        callback(new Error('请至少选择一个所属角色'))
      }
    }
    return {
      btnClicked: false,
      userTypeone: 0,
      userTypetwo: 1,
      btn: false,
      roleType: '', // 所属系统-运营
      favourableForm: [], // 选中的数据
      favourables: [], // 初始化赋值-运营
      show: false,
      defaultProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      ruleForm: {
        getTree: null,
        showChildrenNode: null,
        username: '',
        realname: '',
        userType: '', // 用户类型
        departmentId: '',
        departmentName: '',
        mobile: '',
        email: '',
        roleIds: []
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: usernameReg }],
        realname: [{ required: true, trigger: 'blur', validator: realnameReg }],
        userType: [{ required: true, trigger: 'change', validator: userTypeReg }],
        departmentId: [{ required: true, trigger: 'change', validator: departmentIdReg }],
        mobile: [{ required: true, trigger: 'blur', validator: mobileReg }],
        email: [{ required: true, trigger: 'blur', validator: emailReg }],
        roleIds: [{ required: true, trigger: 'change', validator: roleIdReg }]
      }
    }
  },
  created() {
    alongRoles({}).then(response => { // 初始加载所属角色
      const list = response.result
      const arr = []
      // const arrSales = []
      for (var i = 0; i < list.length; i++) {
        if (list[i].roleType === 'OPER') {
          this.roleType = '运营系统'
          arr.push(list[i])
        }
      }
      this.favourables = arr
    })
    handleUpdateMethod({// 查看详情
      id: this.$route.query.id
    }).then(response => {
      if (response.success === true) {
        this.ruleForm = response.result.user
        this.ruleForm.departmentName = response.result.department.departmentName // 所属部门
        this.ruleForm.departmentId = response.result.department.id // 所属部门id
        var choosedRoles = response.result.roleList
        for (let i = 0; i < choosedRoles.length; i++) {
          this.favourableForm.push(choosedRoles[i])
        }
      }
    })
  },

  methods: {
    handleNodeClick(data) { // 点击每一级部门回调函数
      this.ruleForm.departmentName = data.departmentName
      this.ruleForm.departmentId = data.id
    },
    // 异步树叶子节点懒加载逻辑
    loadNode(node, resolve) {
      // 一级节点处理
      if (node.level === 0) {
        this.requestTree(resolve)
      }
      // 其余节点处理
      if (node.level >= 1) {
        // 把resolve传到你自己的异步中去
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
      })
    },
    // 点击下拉图标请求树
    isShowTree() {
      this.show = !this.show
      this.btn = !this.btn
    },
    btnshow() {
      this.show = !this.show
      this.btn = !this.btn
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const roleStrings = this.favourableForm.join(',')
          this.btnClicked = true
          handleUpdateConfirmMethod({
            userId: this.$route.query.id,
            realname: this.ruleForm.realname,
            departmentId: this.ruleForm.departmentId,
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
              this.$router.push({ name: 'User', params: { flush: 'on' }})
            }, 500)
          }).catch(error => {
            this.btnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
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
