<template>
  <div id="login">
    <p>欢迎登陆</p>
    <el-form ref="form" :modal="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="form.captcha" type="capthcha" placeholder="请输入验证码" ></el-input>
        <el-image :src="src"  @click="reflushCaptcha"></el-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" >立即登陆</el-button>
      </el-form-item>
      <p>{{msg}}</p>
    </el-form>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

let data = {
  form: {
    username: '',
    password: '',
    captcha: ''
  },
  src: '/api/loginCaptcha',
  msg: '',
  onLogging: false
}

export default {
  data: function () {
    return data
  },
  methods: {
    ...mapActions(['logIn']),
    onSubmit: function (e) {
      if (this.onLogging) {
        this.msg = '正在登陆中'
        return false
      }
      this.onLogging = true
      if (!this.form.username || !this.form.password) {
        this.msg = '请输入账号密码'
        this.onLogging = false
        return
      }
      if (!this.form.captcha) {
        this.msg = '请输入验证码'
        this.onLogging = false
        return
      }
      this.$axios.post('/api/login', {username: this.form.username, password: this.form.password, captcha: this.form.captcha})
        .then((response) => {
          let data = response.data
          if (data.success) {
            this.logIn(data.result)
          } else {
            this.msg = data.message
            this.onLogging = false
          }
        }).catch((err) => {
          console.log(err)
          data.src = '/api/loginCaptcha?v=' + new Date()
        }).finally(() => {
          this.onLogging = false
        })
    },
    reflushCaptcha: function () {
      data.src = '/api/loginCaptcha?v=' + new Date()
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
