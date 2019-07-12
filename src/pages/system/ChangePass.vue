<template>
    <div id="login">
    <p>修改密码</p>
    <el-form ref="form" :modal="form" label-width="80px">
      <el-form-item label="原密码">
        <el-input v-model="form.password" type="password" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.passwordnew1" type="password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.passwordnew2" type="password" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" >修改</el-button>
      </el-form-item>
      <p>{{msg}}</p>
    </el-form>
  </div>
</template>
<script>

import { mapActions } from 'vuex'

let data = {
  form: {
    password: '',
    passwordnew1: '',
    passwordnew2: ''
  },
  msg: '',
  onLogging: false
}

export default {
  data: function () {
    return data
  },
  methods: {
    ...mapActions(['logOut']),
    onSubmit: function (e) {
      if (this.onLogging) {
        this.msg = '正在修改中'
        return false
      }
      this.onLogging = true
      if (!this.form.password) {
        this.msg = '请输入密码'
        this.onLogging = false
        return
      }
      if (!this.form.passwordnew1) {
        this.msg = '请输入新密码'
        this.onLogging = false
        return
      }
      if (!this.form.passwordnew2) {
        this.msg = '请再次输入新密码'
        this.onLogging = false
        return
      }
      if (this.form.passwordnew2 !== this.form.passwordnew1) {
        this.msg = '两次新密码输入不一致'
        this.onLogging = false
        return
      }
      var httpClient = this.HttpUtils
      var vm = this
      httpClient.post('changePassword', {password: this.form.password, newpass: this.form.passwordnew2})
        .then((response) => {
          if (response.data.success) {
            this.msg = '修改成功，即将重新登录'
            setTimeout(function () {
              httpClient.post('logout').then((response) => {
                console.log('logout')
              }).finally(() => {
                vm.logOut()
              })
            }, 1000)
          } else {
            this.msg = response.data.message
            this.onLogging = false
          }
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.onLogging = false
        })
    }
  }
}
</script>
<style>
  #login {
    width: 300px;
    margin: 0 auto;
  }
</style>
