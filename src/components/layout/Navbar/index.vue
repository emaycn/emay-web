<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidbarOpend()" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span style="font-size:15px;">欢迎您:{{ userRealname() }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/changepass">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb.vue'
import Hamburger from './Hamburger.vue'
import { logOut } from '@/api/public/logout'// 接口

export default {
  name: 'NavBar',
  components: {
    Breadcrumb,
    Hamburger
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    sidbarOpend() {
      return this.$store.state.sidebar.opened
    },
    logout() {
      this.$store.commit('LOGOUT')
      this.$store.commit('DELETE_ALL_ROUTES')
      logOut()
      this.SessionStorageUtils.setStore()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    userRealname() {
      return this.$store.state.webToken.user === null ? '' : this.$store.state.webToken.user.realname
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar .right-menu .avatar-container .avatar-wrapper .el-icon-caret-bottom[data-v-2f9101d0] {
    cursor: pointer;
    position: absolute;
    right: -16px;
    top: 19px;
    font-size: 13px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
