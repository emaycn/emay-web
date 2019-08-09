<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import SessionStorageUtils from '@/utils/SessionStorageUtils'

export default {
  name: 'App',
  beforeCreate () {
    const sessionStore = SessionStorageUtils.get('store')
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStore) {
      this.$store.replaceState(Object.assign({}, this.$store.state, sessionStore))
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      SessionStorageUtils.set('store', this.$store.state, function (key, val) {
        switch (key) {
          case 'matched':
            return null
          default:
            return val
        }
      })
    })
  }
}
</script>
