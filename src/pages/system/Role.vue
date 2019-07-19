<template>
    <div>
        <p>角色管理页面</p>
    </div>
</template>

<script>

let data = {

}

export default {
  data: function () {
    return data
  },
  methods: {
    findRolePage: function () {

    },
    addRole: function () {

    },
    modifyRole: function () {

    },
    deleteRole: function () {

    }
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
