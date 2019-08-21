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
      <el-form-item label="所属部门：" prop="departmentId">
        <el-input v-model="ruleForm.departmentName" disabled>
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
            style="border:1px solid #d0d0d0;"
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
        <el-checkbox-group v-model="ruleForm.roleIds">
          <el-checkbox v-for="item in ruleForm.alongRoles" :key="item.key" :label="item.id">{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="密码提示"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
    >
      <span>生成的随机6位密码是：{{ mmdata }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createMM">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { getTree, showChildrenNode, alongRoles, addConfirm } from '@/api/system/user'// 接口
import { user_name, real_name, phone, userEmail } from '@/utils/Validate' // validate 验证
export default {
  name: 'Useradd',
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
      if (!value.length) {
        callback(new Error('请至少选择一个所属角色'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      btn: false,
      mmdata: '',
      defaultProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      ruleForm: {
        getTree: null,
        showChildrenNode: null,
        alongRoles: [],
        username: '',
        realname: '',
        departmentId: '',
        departmentName: '',
        mobile: '',
        email: '',
        roleIds: []
      },
      dialogVisible: false,
      rules: {
        username: [{ required: true, trigger: 'blur', validator: usernameReg }],
        realname: [{ required: true, trigger: 'blur', validator: realnameReg }],
        departmentId: [{ required: true, trigger: 'change', validator: departmentIdReg }],
        mobile: [{ required: true, trigger: 'blur', validator: mobileReg }],
        email: [{ required: true, trigger: 'blur', validator: emailReg }],
        roleIds: [{ required: true, trigger: 'change', validator: roleIdReg }]
      }
    }
  },
  created() {
    alongRoles({}).then(response => { // 初始加载所属角色
      this.ruleForm.alongRoles = response.result
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
      showChildrenNode({ // 请求子级部门
        id: node.data.id
      }).then(response => {
        resolve(response.result)
      })
    },
    // 首次加载一级节点数据函数
    requestTree(resolve) {
      getTree({}).then(response => { // 初始加载请求一级部门树
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
    createMM() {
      setTimeout(() => {
        this.$store.dispatch('delVisitedView', this.$route)
        this.$router.push({ name: 'User', params: { flush: 'on' }})
      }, 500)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const roleStrings = this.ruleForm.roleIds.join(',')
          addConfirm({
            username: this.ruleForm.username,
            realname: this.ruleForm.realname,
            departmentId: this.ruleForm.departmentId,
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
