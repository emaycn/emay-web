<template>
<el-menu default-active="1" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <!-- 一级菜单 -->
    <template v-for="item in list">
        <el-submenu v-if="item.children && item.children.length" :index="item.path" :key="item.path">
        <template slot="title"><i :class="item.icon"></i><span>{{item.name}}</span></template>
        <!-- 二级菜单 -->
        <template v-for="itemChild in item.children">
            <el-submenu v-if="itemChild.children && itemChild.children.length" :index="itemChild.path" :key="itemChild.path">
                <template slot="title"><i :class="itemChild.icon"></i><span>{{itemChild.name}}</span></template>
            </el-submenu>
            <el-menu-item v-else :index="itemChild.path" :key="itemChild.path"><i :class="itemChild.icon"></i><span slot="title">{{itemChild.name}}</span></el-menu-item>
        </template>
        </el-submenu>
        <el-menu-item v-else :index="item.path" :key="item.path"><i :class="item.icon"></i><span slot="title">{{item.name}}</span></el-menu-item>
    </template>
</el-menu>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          path: '/1',
          name: '导航一',
          icon: 'el-icon-menu',
          children: [
            {
              path: '/1/1',
              name: '导航1-1',
              icon: 'el-icon-menu'
            },
            {
              path: '/1/2',
              name: '导航1-2',
              icon: 'el-icon-menu'
            }
          ]
        },
        {
          path: '/2',
          name: '导航二',
          icon: 'el-icon-menu',
          children: [
            {
              path: '/2/1',
              name: '导航2-1',
              icon: 'el-icon-menu'
            },
            {
              path: '/2/2',
              name: '导航2-2',
              icon: 'el-icon-menu'
            },
            {
              path: '/2/3',
              name: '导航2-3',
              icon: 'el-icon-menu'
            }
          ]
        }
      ]
    }
  }
}
</script>
