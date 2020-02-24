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
      <el-form-item label="所属系统：">
        <el-input v-model="logFor" disabled />
      </el-form-item>
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
          v-if="isOpers"
          ref="tree"
          :data="data"
          show-checkbox
          default-expand-all
          node-key="auth"
          highlight-current
          :props="defaultProps"
          :render-content="renderContent"
        />
        <el-tree
          v-if="isSales"
          ref="treesales"
          :data="salesdata"
          show-checkbox
          default-expand-all
          node-key="auth"
          highlight-current
          :props="defaultProps"
          :render-content="renderContent"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :disabled="btnClicked" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addConfirm } from '@/api/system/role'// 接口
import { allroleName } from '@/utils/Validate' // validate 验证
import rtree from '@/router/resource-tree'
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
      btnClicked: false,
      favourableForm: [], // 选中的角色权限
      ruleForm: {
        roleName: '',
        remark: '',
        resourceCodes: ''
      },
      isOpers: true,
      isSales: false,
      rules: {
        roleName: [{ required: true, trigger: 'blur', validator: roleNameReg }],
        remark: [{ required: true, trigger: 'blur', validator: remarkReg }]
        // resourceCodes: [{ required: true, trigger: 'blur', validator: resourceIdsReg }]
      },
      logFor: this.coverLogFor(this.$route.query.roleType),
      data: rtree.oper,
      salesdata: rtree.client,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    const roleType = this.$route.query.roleType
    if (roleType === 'OPER') {
      this.isOpers = true
      this.isSales = false
    } else {
      this.isOpers = false
      this.isSales = true
    }
  },
  mounted() {
    console.log('mountend')
    var nodes = document.getElementsByClassName('last-node')
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].parentElement.parentElement.style.cssFloat = 'left' // 增加css样式
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        const roleType = this.$route.query.roleType
        let arr
        if (roleType === 'OPER') {
          arr = this.$refs['tree'].getCheckedKeys()
        } else {
          arr = this.$refs['treesales'].getCheckedKeys()
        }
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
          this.btnClicked = true
          addConfirm({
            roleType: roleType, // 所属系统
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
            this.btnClicked = false
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    coverLogFor(type) {
      if (type === 'OPER') {
        return '运营系统'
      } else {
        return '客户系统'
      }
    },
    renderContent(h, { node, data, store }) {
      let classname = ''
      if (node.level === 3) { // 给最后一个节点，添加class=last-node，根据last-node，寻找父父dom，并添加float：left
        classname = 'last-node'
      }
      return (<span class={classname}><span>{node.label}</span></span>)
    }
  }
}
</script>

<style scoped>
.ruleForm {
  width: 96%;
  margin-left: 2%;
}
</style>
