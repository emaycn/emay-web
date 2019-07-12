<template>
    <div id="login">
    <p>修改密码</p>
    <el-form ref="form" :modal="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="原密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="原密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="原密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" >修改</el-button>
      </el-form-item>
      <p>{{msg}}</p>
    </el-form>
  </div>
</template>
<script>

let data = {
  form: {
    username: '',
    password: '',
    captcha: ''
  },
  msg: '',
  onLogging: false
}

export default {
  data: function () {
    return data
  },
  methods: {
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
      this.HttpUtils.post('login', {username: this.form.username, password: this.form.password, captcha: this.form.captcha})
        .then((response) => {
          if (response.data.success) {
            this.logIn(response.data.result)
          } else {
            this.msg = response.data.message
            this.onLogging = false
          }
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.onLogging = false
        })
    },
    reflushCaptcha: function () {
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
