<template>
  <div :class="{'has-logo':true}">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 侧边栏渲染 -->
        <template v-for="route in routes">
          <template v-if="hasShowingChild(route)">
            <sidebar-item :key="route.path" :item="route" :base-path="route.path" />
          </template>
        </template>

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  name: 'SideBar',
  components: { SidebarItem, Logo },
  computed: {
    activeMenu() {
      const route = this.$route
      const { path } = route
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.$store.state.sidebar.opened
    },
    routes() {
      return this.$store.state.routes.array
    }
  },
  methods: {
    hasShowingChild(route) {
      const showingChildren = route.children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          return true
        }
      })
      return showingChildren.length > 0
    }
  }
}
</script>
