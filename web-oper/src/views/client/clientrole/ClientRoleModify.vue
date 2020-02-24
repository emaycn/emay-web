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
          v-if="lastchecked.length>0 && isOpers"
          ref="tree"
          :data="data"
          show-checkbox
          default-expand-all
          node-key="auth"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="lastchecked"
          :render-content="renderContent"
        />
        <el-tree
          v-if="lastcheckedsales.length>0 && isSales"
          ref="treesales"
          :data="salesdata"
          show-checkbox
          default-expand-all
          node-key="auth"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="lastcheckedsales"
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
import { handleUpdateMethod, handleUpdateConfirmMethod } from '@/api/client/role'// 接口
import { allroleName } from '@/utils/Validate' // validate 验证
import rtree from '@/router/resource-tree'
export default {
  name: 'ClientRoleModify',
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
      favourableForm: [], // 选中的数据
      favourables: [], // 初始化赋值
      lastchecked: [],
      lastcheckedsales: [],
      ruleForm: {
        roleName: '',
        remark: '',
        resourceCodes: ''
      },
      isOpers: false,
      isSales: true,
      rules: {
        roleName: [{ required: true, trigger: 'blur', validator: roleNameReg }],
        remark: [{ required: true, trigger: 'blur', validator: remarkReg }]
        // resourceCodes : [{ required: true, trigger: 'blur', validator: resourceIdsReg }]
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
    handleUpdateMethod({// 查看详情
      roleId: this.$route.query.roleId
    }).then(response => {
      if (response.success === true) {
        this.ruleForm.roleName = this.$route.query.roleName// 角色名称
        this.ruleForm.remark = this.$route.query.remark// 角色描述
        const roleType = this.$route.query.roleType
        var choosedResourceCodes = response.result
        for (let i = 0; i < choosedResourceCodes.length; i++) {
          this.favourableForm.push(choosedResourceCodes[i].resourceCode)
        }
        // 获取所有三级的auth ,存到favourables 数组里
        if (roleType === 'OPER') {
          this.data.map(item => {
            item.children.length && item.children.map(items => {
              items.children.length && items.children.map(itemss => {
                this.favourableForm.map(props => {
                  if (props === itemss.auth) { // 回显已选中的checkbox
                    this.lastchecked.push(itemss.auth)
                  }
                })
              })
            })
          })
        } else {
          this.salesdata.map(item => {
            item.children.length && item.children.map(items => {
              items.children.length && items.children.map(itemss => {
                this.favourableForm.map(props => {
                  if (props === itemss.auth) { // 回显已选中的checkbox
                    this.lastcheckedsales.push(itemss.auth)
                  }
                })
              })
            })
          })
        }
      }
    })
  },
  updated() {
    console.log('updated')
    var nodes = document.getElementsByClassName('last-node')
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].parentElement.parentElement.style.cssFloat = 'left'
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
        var newArr = []
        arr.forEach(item => {
          if (item) {
            newArr.push(item)
          }
        })
        if (newArr.length === 0) {
          this.$message({
            type: 'error',
            message: '请至少选择一个角色权限!'
          })
          return
        }
        if (valid) {
          const resourceCodesStrings = newArr.join(',')
          this.btnClicked = true
          handleUpdateConfirmMethod({
            roleId: this.$route.query.roleId,
            roleName: this.ruleForm.roleName, // 角色名称
            remark: this.ruleForm.remark, // 角色描述
            resourceCodes: resourceCodesStrings // 角色权限
          }).then(response => {
            this.$message({
              message: '修改角色操作成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$store.dispatch('delVisitedView', this.$route)
              this.$router.push({ name: 'ClientRole', params: { flush: 'on' }})
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
  width:96%;
  margin-left:2%;
}
</style>
