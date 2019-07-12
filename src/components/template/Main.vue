<template>
<div>
    <Login v-if="!myLogin()"></Login>
    <el-row class="container" v-if="myLogin()">
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <section  class="header">
                    <div  v-if="!collapsed" style="padding-left:20px;text-align:center;font-size:x-large;float:left;cursor:pointer;" @click="gotoHome">
                            亿美数据平台
                    </div>
                    <div class="tools" style="text-align:center;float:left;" @click.prevent="collapse">
                        <i class="el-icon-menu"></i>
                    </div>
                </section>
                <!--导航菜单-->
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" v-bind:style=" collapsed ? {} : { 'width': '230px' } " :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router v-show="!collapsed">
                    <template v-for="(item,index) in menuData" >
                        <el-submenu :index="index+''" v-if="!item.hidden" :key="item.path + '1'">
                            <template slot="title">
                                <i :class="item.iconCls"></i>{{item.name}}
                            </template>
                            <template v-for="child in item.children" >
                                <el-menu-item :index="child.path" :key="child.path" v-if="!child.hidden">
                                    <i :class="child.iconCls"></i>{{child.name}}
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed el-menu-collapsed" v-show="collapsed" ref="menuCollapsed">
                    <template v-for="(item,index) in menuData">
                        <li  v-if="!item.hidden" class="el-submenu item" :key="item.path + '3'">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <i :class="item.iconCls"></i>
                            </div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <template v-for="child in item.children">
                                <li  v-if="!child.hidden" :key="child.path+'4'" class="el-menu-item" style="padding-left: 40px; color: #fff;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{child.name}}
                                </li>
                                </template>
                            </ul>
                        </li>
                     </template>
                </ul>
            </aside>
            <section class="content-container">
                <el-col :span="24" class="header">
                    <el-col :span="24" class="userinfo">
                        <el-dropdown trigger="hover">
                            <span class="el-dropdown-link userinfo-inner">
                                您好：{{userRealname()}}
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <a @click="changePass">修改密码</a>
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="logout">
                                    注销登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-col>
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</div>
</template>

<script>

import Login from '@/components/template/Login.vue'
import { mapActions } from 'vuex'
import { hasAuth, isLogin, currentUser } from '@/utils/AuthUtils'

let data = () => {
  return {
    menuData: [],
    collapsed: false
  }
}

export default {
  data: data,
  components: {Login},
  methods: {
    ...mapActions(['logOut']),
    userRealname: function () {
      let user = currentUser()
      return user === null ? null : user.realname
    },
    myLogin: function () {
      return isLogin()
    },
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    showMenu: function (i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
    },
    changePass: function () {
      // TODO
      console.log('changepass')
    },
    logout: function () {
      this.logOut()
    },
    gotoHome: function () {
      this.$router.push('/')
    },
    initMenu: function () {
      for (let i in this.$router.options.routes) {
        let root = this.$router.options.routes[i]
        if (!hasAuth(root.auth)) {
          root.hidden = true
          continue
        }
        let children = []
        for (let j in root.children) {
          let item = root.children[j]
          if (!hasAuth(item.auth)) {
            item.hidden = true
            continue
          }
          children.push(item)
        }
        if (children.length < 1) {
          continue
        }
        root.children = children
        this.menuData.push(root)
      }
    }
  },
  mounted: function () {
    this.initMenu()
  }

}
</script>

<style scoped="scoped" lang="scss">
.container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .header {
        height: 60px;
        line-height: 60px;
        background: #545c64;
        color: #fff;
        .userinfo {
            text-align: right;
            padding-right: 35px;
            float: right;
            .userinfo-inner {
                cursor: pointer;
                color: #fff;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    margin: 10px 0 10px 10px;
                    float: right;
                }
            }
        }
        .logo {
            height: 60px;
            font-size: 22px;
            padding-left: 20px;
            padding-right: 20px;
            border-color: rgba(238, 241, 146, 0.3);
            border-right-width: 1px;
            border-right-style: solid;
            img {
                width: 40px;
                float: left;
                margin: 10px 10px 10px 18px;
            }
            .txt {
                color: #fff;
            }
        }
        .logo-width {
            width: 230px;
        }
        .logo-collapse-width {
            width: 60px;
        }
        .tools {
            padding-left: 25px;
            // width: 30px;
            height: 60px;
            line-height: 60px;
            cursor: pointer;
        }
    }
    .main {
        display: flex;
        // position: absolute;
        // top: 60px;
        bottom: 0;
        overflow: hidden;
        aside {
            height:100vh;
            flex: 0 0 230px;
            width: 230px;
            /*侧边菜单*/
            .el-menu {
                height: 100%;
                background-color: #545c64;
                /*选中列*/
                .el-menu-item {
                    background-color: #545c64;
                }
                .el-submenu__title {
                    i {
                        color: #fff;
                    }
                }
            }
            .el-menu:first-child {
                overflow-y: auto !important;
            }
            .el-menu-collapsed li:hover {
                background-color: #434a50;
            }
            /*当前选中菜单*/
            .is-opened {
                color: #fff;
                background-color: #fff;
            }
            .collapsed {
                width: 60px;
                .item {
                    position: relative;
                }
                .submenu {
                    position: absolute;
                    top: 0;
                    left: 60px;
                    z-index: 99999;
                    height: auto;
                    display: none;
                }
            }
        }
        .menu-collapsed {
            flex: 0 0 60px;
            width: 60px;
        }
        .menu-expanded {
            flex: 0 0 230px;
            width: 230px;
        }
        .content-container {
            flex: 1;
            overflow-y: auto;
            // padding: 20px;
            background-color: #d3d7d4;
            .breadcrumb-container {
                display: block;
                .title {
                    width: 200px;
                    float: left;
                    color: #475669;
                }
                .breadcrumb-inner {
                    float: right;
                }
            }
            .content-wrapper {
                box-sizing: border-box;
            }
        }
    }
}
</style>
