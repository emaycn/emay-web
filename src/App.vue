<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import SessionStorageUtils from '@/utils/SessionStorageUtils'

export default {
  name: 'App',
  beforeCreate() {
    const sessionStore = SessionStorageUtils.getStore()
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStore) {
      this.$store.replaceState(Object.assign({}, this.$store.state, sessionStore))
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      SessionStorageUtils.setStore()
    })
    // 测试 appconfig.js 是否可用
    console.log(window.g.production_domain)
  }
}
</script>

