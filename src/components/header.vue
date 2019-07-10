<template>
    <div>
      <el-row>
        <el-col :span="6" :offset="18">
          <el-button type="success" class="userIcon">{{$store.state.webToken.user.realname}}</el-button>
          <el-button type="primary" @click="onLogout" round class="signout">注销</el-button>
        </el-col>
      </el-row>

    </div>
</template>

<script>
import ElCol from 'element-ui/packages/col/src/col'
import { mapActions } from 'vuex'

export default {
  components: {ElCol},
  methods: {
    ...mapActions(['logOut']),
    onLogout: function () {
      this.logOut()
    }
  }
}
</script>

<style>

</style>
