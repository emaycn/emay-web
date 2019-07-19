<template>
    <div>
        <p>用户管理页面</p>
    </div>
</template>
<script>

let data = {

}

export default {
  data: function () {
    return data
  },
  mounted: function () {
    if (!this.AuthUtils.hasAuth(this.PAGE_AUTH[this.$route.path])) {
      this.$router.push('/error')
    }
  }
}

</script>
<style>
</style>
