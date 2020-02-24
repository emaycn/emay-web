<template>
  <div class="app-container">
    <el-form
      ref="addForm"
      :model="addForm"
      status-icon
      :rules="formRules"
      label-width="150px"
      size="mini"
      class="addForm"
    >
      <el-form-item label="应用名称：" prop="appName">
        <el-input v-model="addForm.appName" placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item label="所属客户：" prop="clientName">
        <el-autocomplete
          v-model="addForm.clientName"
          class="inline-input"
          placeholder="请输入客户名称"
          :fetch-suggestions="methodLikeClient"
          :trigger-on-focus="false"
          :style="{'width': '100%'}"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item label="服务号是否自选：">
        <el-select v-model="addForm.isOptional" placeholder="请选择" style="width:100%;">
          <el-option v-for="item in optionSelf" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="addForm.isOptional === 0" label="服务号位数:">
        <el-select
          v-model="addForm.appCodeLength"
          placeholder="请选择"
          style="width:100%;"
          :disabled="addForm.isOptional === 1"
        >
          <el-option
            v-for="item in optionBitCount"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="addForm.isOptional === 1"
        label="服务号："
        prop="appCode"
      >
        <el-input v-model="addForm.appCode" :disabled="addForm.isOptional === 0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="btnClicked" @click="addFromSubmit('addForm')">确定</el-button>
        <el-button @click="$store.dispatch('delVisitedView', $route);$router.go(-1);">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 创建成功提示 -->
    <el-dialog title="创建成功提示" :visible.sync="callbackDialogShow" width="50%" :show-close="false">
      <el-row class="row" :gutter="40">
        <el-col :span="12" class="right">应用名称：</el-col>
        <el-col :span="12" class="left">{{ callbackData.appName }}</el-col>
      </el-row>
      <el-row class="row" :gutter="40">
        <el-col :span="12" class="right">AppKey：</el-col>
        <el-col :span="12" class="left">{{ callbackData.appKey }}</el-col>
      </el-row>
      <el-row class="row" :gutter="40">
        <el-col :span="12" class="right">AppCode：</el-col>
        <el-col :span="12" class="left">{{ callbackData.appCode }}</el-col>
      </el-row>
      <el-row class="row" :gutter="40">
        <el-col :span="12" class="right">AppSecret：</el-col>
        <el-col :span="12" class="left">{{ callbackData.appSecret }}</el-col>
      </el-row>
      <el-row class="row" :gutter="40">
        <el-col :span="12" class="right">价格：</el-col>
        <el-col :span="12" class="left">￥{{ callbackData.price }}</el-col>
      </el-row>
      <el-row class="row" :gutter="40">
        <el-col :span="12" class="right">备注：</el-col>
        <el-col :span="12" class="left">{{ callbackData.remark }}</el-col>
      </el-row>
      <el-row class="row" :gutter="40">
        <el-col :span="12" class="right">状态：</el-col>
        <el-col :span="12" class="left" :class="formatClass(callbackData.state)">{{ formatStatus(callbackData.state) }}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="methodCallbackDialogClose()">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { apiAdd } from '@/api/sms/app/app.js' // 后台接口
import { findByClientName } from '@/api/client/client.js'// 接口
export default {
  name: 'AppAdd',
  data() {
    // 表单验证规则
    // 客户
    var appNameReg = (rule, value, callback) => {
      console.log('check appNameReg' + value)
      if (value === '') {
        callback(new Error('请选输入应用名称'))
      } else {
        callback()
      }
    }
    // 客户
    var clientNameReg = (rule, value, callback) => {
      console.log('check clientNameReg' + value)
      if (value === '') {
        callback(new Error('请选择所属客户'))
      } else {
        callback()
      }
    }
    // 服务号
    var appCodeReg = (rule, value, callback) => {
      console.log('check appCodeReg' + value)
      if (this.addForm.isOptional === 0) { // 选择否，不校验
        callback()
      } else {
        if (value === '') {
          callback(new Error('服务号不能为空'))
        } else {
          if (value.length === 3 && (value.startsWith('6') || value.startsWith('8') || value.startsWith('9') || value.startsWith('1') || value.startsWith('0'))) {
            console.log('3-68910')
            callback()
          } else if (value.length === 6 && (value.startsWith('2') || value.startsWith('5') || value.startsWith('7') || value.startsWith('4') || value.startsWith('3'))) {
            console.log('6-25743')
            callback()
          } else {
            callback(new Error('服务号格式有误：3位-以6|8|9|1|0开头，6位-以2|5|7|4|3开头'))
          }
        }
      }
    }
    return {
      btnClicked: false,
      callbackDialogShow: false, // Dialog是否展示
      callbackData: {}, // appkey回传数据
      addForm: { // 表单数据
        appName: '',
        clientId: 0,
        clientName: '',
        isOptional: 0, // 默认：否
        appCodeLength: 3, // 3 或 6
        appCode: ''
      },
      formRules: { // 表单验证规则
        appName: [{ required: true, trigger: 'blur', validator: appNameReg }],
        clientName: [{ required: true, trigger: 'blur', validator: clientNameReg }],
        appCode: [{ required: true, trigger: 'blur', validator: appCodeReg }]
      },
      optionSelf: [
        { id: 1, name: '是' },
        { id: 0, name: '否' }
      ],
      optionBitCount: [
        { id: 3, name: '3位' },
        { id: 6, name: '6位' }
      ]
    }
  },
  created() {
    this.addFrom = {}
  },
  methods: {
    // 提交表单
    addFromSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnClicked = true
          apiAdd(this.addForm).then(response => {
            if (response.success === true) {
              // 显示模态框
              this.callbackDialogShow = true
              this.callbackData = response.result
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
    // 模糊查询客户
    methodLikeClient(queryString, callback) {
      console.log('quertString=' + queryString)
      findByClientName({
        clientName: queryString
      }).then(resp => {
        console.log(resp)
        var clientNameMap = []
        for (const item of resp.result) {
          clientNameMap.push({ 'value': item.clientName, 'key': item.id })
        }
        callback(clientNameMap) // 调用 callback 返回建议列表的数据
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 模糊结果被选择
    handleSelect(item, index) {
      console.log('选择了：' + item.value + '-' + item.key)
      this.addForm.clientId = item.key
      this.addForm.clientName = item.value
    },
    // 关闭回调Dialog
    methodCallbackDialogClose() {
      this.callbackDialogShow = false
      setTimeout(() => {
        this.$store.dispatch('delVisitedView', this.$route)
        this.$router.push({ name: 'Appp', params: { flush: 'on' }})
      }, 500)
    },
    // 格式化状态
    formatStatus(state) {
      if (state === 1) {
        return '启用'
      } else {
        return '停用'
      }
    },
    // 格式化class
    formatClass(state) {
      if (state === 1) {
        return 'green'
      } else {
        return 'red'
      }
    }
  }
}
</script>

<style scoped>
.addForm {
  width: 500px;
  margin: 10% auto;
}
span {
  color: rgb(49, 47, 47);
}
.tree {
  max-height: 200px;
  overflow-y: auto;
  border-bottom: 1px solid #dfe4ed;
  border-left: 1px solid #dfe4ed;
  border-right: 1px solid #dfe4ed;
}
.right {
  text-align: right;
}
.left {
  text-align: left;
}
.row {
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  padding-bottom: 15px;
}

.green {
  color: green;
}
.red {
  color: red;
}
</style>
