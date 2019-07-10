<template>
  <div id="app">
    <el-container v-if="isLogin" class="main-container" >
        <el-aside width="240px">
          <Nav></Nav>
        </el-aside>
      <el-container>
        <el-header class="header">
          <Header></Header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
    <Login v-if="!isLogin"></Login>
  </div>
</template>

<script>
import Nav from './components/nav.vue'
import Header from './components/header.vue'
import Login from './pages/login.vue'

export default {
  components: {
    // ES6简写语法 Nav:Nav
    Nav,
    Header,
    Login
  },
  name: 'app',
  computed: {
    isLogin () {
      // 读取全局状态，获取用户是否登陆，决定渲染状态
      return this.$store.state.webToken.user !== null
    }
  }
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
