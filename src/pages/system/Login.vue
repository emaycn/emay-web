<template>
  <div id="login">
    <p>亿美数据平台</p>
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

function generateUUID () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

var uuid = generateUUID()

let data = {}

export default {
  data: function () {
    data = {
      form: {
        username: '',
        password: '',
        captcha: '',
        uuid: uuid
      },
      src: this.getSrc(),
      msg: '',
      onLogging: false
    }
    return data
  },
  methods: {
    ...mapActions(['logIn']),
    getSrc: function () {
      return this.SystemConfig.SERVER_ADDERSS + 'loginCaptcha?uuid=' + uuid + '&' + new Date().getTime()
    },
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
      this.HttpUtils.post('login', {username: this.form.username, password: this.form.password, captcha: this.form.captcha, uuid: this.form.uuid})
        .then((response) => {
          if (response.data.success) {
            this.logIn(response.data.result)
            this.$router.go(0) // 刷新页面
          } else {
            this.msg = response.data.message
            data.src = this.getSrc()
            this.onLogging = false
          }
        }).catch((err) => {
          console.log(err)
          data.src = this.getSrc()
        }).finally(() => {
          this.onLogging = false
        })
    },
    reflushCaptcha: function () {
      data.src = this.getSrc()
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
