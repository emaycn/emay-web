<template>
  <div class="app-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <!-- 使用标签组件 -->
          <tab-pane v-if="activeName==item.key" :role-type="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/Role' // 引入共同子组件
export default {
  name: 'Rx', // 设置路由名称
  components: { tabPane }, // 将组件隐射为标签
  data() {
    return {
      tabMapOptions: [
        { label: '运营系统', key: 'OPER' },
        { label: '客户系统', key: 'CLIENT' }
      ],
      activeName: 'OPER'
    }
  },
  watch: {
    // 监听值的变化
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }

  },
  created() {
    // 初始化默认选择的选项卡
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>

<style>
</style>
