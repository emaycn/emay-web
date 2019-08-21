import store from '@/store'

export default {
  set: function(key, value, replacer) {
    sessionStorage.setItem(key, JSON.stringify(value, replacer))
  },
  get: function(key) {
    return JSON.parse(sessionStorage.getItem(key)) || null
  },
  remove: function(key) {
    sessionStorage.removeItem(key)
  },
  setStore: function() {
    this.set('store', store.state, function(key, val) {
      switch (key) {
        case 'matched':
          return null
        case 'component':
          return null
        default:
          return val
      }
    })
  },
  getStore: function() {
    return this.get('store')
  }
}
