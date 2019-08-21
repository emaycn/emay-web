<template>
  <div class="roleadd app-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      size="mini"
      class="ruleForm"
    >
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="ruleForm.roleName" maxlength="20" />
      </el-form-item>
      <el-form-item label="角色描述：" prop="remark">
        <el-input
          v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          type="textarea"
          maxlength="50"
          resize="none"
        />
      </el-form-item>

      <el-form-item label="角色权限：">
        <el-tree
          ref="tree"
          :data="data"
          show-checkbox
          default-expand-all
          node-key="auth"
          highlight-current
          :props="defaultProps"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addConfirm } from '@/api/system/role'// 接口
import { allroleName } from '@/utils/Validate' // validate 验证
export default {
  name: 'Roleadd',
  data() {
    // 表单验证规则 角色名称
    var roleNameReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('角色名称不能为空'))
      } else if (!allroleName(value)) {
        callback(new Error('角色名不能包含特殊字符'))
      } else {
        callback()
      }
    }
    // 角色描述
    var remarkReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('角色描述不能为空'))
      } else {
        callback()
      }
    }
    // 角色权限
    // var resourceIdsReg = (rule, value, callback) => {
    //   if (!value.length) {
    //     callback(new Error('请至少选择一个角色权限'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      favourableForm: [], // 选中的数据
      ruleForm: {
        roleName: '',
        remark: '',
        resourceCodes: ''
      },
      rules: {
        roleName: [{ required: true, trigger: 'blur', validator: roleNameReg }],
        remark: [{ required: true, trigger: 'blur', validator: remarkReg }]
        // resourceCodes: [{ required: true, trigger: 'blur', validator: resourceIdsReg }]
      },
      data: [{
        label: '系统管理', // 一级
        children: [{
          label: '用户管理', // 二级
          children: [{ // 三级
            id: 1,
            label: '用户查看',
            auth: 'USER_VIEW'
          }, {
            id: 2,
            label: '用户修改',
            auth: 'USER_MODIFY'
          }, { // 三级
            id: 3,
            label: '用户添加',
            auth: 'USER_ADD'
          }, {
            id: 4,
            label: '用户删除',
            auth: 'USER_DELETE'
          }, { // 三级
            id: 5,
            label: '用户操作',
            auth: 'USER_OPER'
          }]
        }, {
          label: '部门管理', // 二级
          children: [{ // 三级
            id: 10,
            label: '部门查看',
            auth: 'DEPARTMENT_VIEW'
          }, {
            id: 11,
            label: '部门添加',
            auth: 'DEPARTMENT_ADD'
          }, {
            id: 12,
            label: '部门删除',
            auth: 'DEPARTMENT_DELETE'
          }, {
            id: 13,
            label: '部门修改',
            auth: 'DEPARTMENT_MODIFY'
          }]
        }, {
          label: '角色管理', // 二级
          children: [{ // 三级
            id: 6,
            label: '角色查看',
            auth: 'ROLE_VIEW'
          }, { // 三级
            id: 7,
            label: '角色修改',
            auth: 'ROLE_MODIFY'
          }, { // 三级
            id: 8,
            label: '角色添加',
            auth: 'ROLE_ADD'
          }, { // 三级
            id: 9,
            label: '角色删除',
            auth: 'ROLE_DELETE'
          }]
        }, {
          label: '日志管理', // 二级
          children: [{ // 三级
            id: 14,
            label: '日志查看',
            auth: 'LOG_VIEW'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        var arr = this.$refs['tree'].getCheckedKeys()
        arr.forEach(item => {
          if (item) {
            this.favourableForm.push(item)
          }
        })
        if (this.favourableForm.length === 0) {
          this.$message({
            type: 'error',
            message: '请至少选择一个角色权限!'
          })
          return
        }
        if (valid) {
          const resourceCodesStrings = this.favourableForm.join(',')
          addConfirm({
            roleName: this.ruleForm.roleName, // 角色名称
            remark: this.ruleForm.remark, // 角色描述
            resourceCodes: resourceCodesStrings // 角色权限
          }).then(response => {
            this.$message({
              message: '新增角色操作成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$store.dispatch('delVisitedView', this.$route)
              this.$router.push({ name: 'Role', params: { flush: 'on' }})
            }, 500)
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
  width:96%;
  margin-left:2%;
}
</style>
