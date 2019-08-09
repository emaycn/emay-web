export default {
  set: function (key, value, replacer) {
    sessionStorage.setItem(key, JSON.stringify(value, replacer))
  },
  get: function (key) {
    return JSON.parse(sessionStorage.getItem(key)) || null
  },
  remove: function (key) {
    sessionStorage.removeItem(key)
  }
}
