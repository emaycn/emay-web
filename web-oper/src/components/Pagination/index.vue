<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total-page.sync="totalPage"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <span style="font-size:13px;color:#606266;">共 {{ totalPage }} 页 &nbsp;&nbsp;</span>
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/ScrollTo'
export default {
  name: 'Pagination',
  props: {
    total: { // 记录总数
      required: true,
      type: Number
    },
    totalPage: { // 总页数
      required: true,
      type: Number
    },
    page: { // 显示的是哪一页
      type: Number,
      default: 1
    },
    start: { // 显示的是哪一页
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: { // 每一页显示的数据条数
      type: Array,
      default() {
        return [20, 50, 100]
      }
    },
    layout: { // 组件布局
      type: String,
      default: 'slot,total, sizes, prev, pager, next, jumper'
    },
    background: { // 是否为分页按钮添加背景色
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: { // 当前页改变时触发
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:start', (val - 1) * this.limit) // 设置start
        this.$emit('update:page', val) // 设置start
      }
    },
    pageSize: { // 每页条数改变时触发
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
        this.$emit('update:page', 1)
        this.$emit('update:totalPage', ((this.total - 1) / val) + 1)
        this.$emit('update:start', 0)
      }
    }

  },
  methods: {
    handleSizeChange(val) { // 每页显示条数改变时触发 --参数待变当前改变的
      this.$emit('pagination', { start: (this.currentPage - 1) * val, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) { // 当前显示页码改变时触发 --参数待变当前改变的
      this.$emit('update:page', val) // 更新当前页码，给currentpage
      this.$emit('pagination', { start: (val - 1) * this.limit, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  float:right;
}
.pagination-container.hidden {
  display: none;
}
</style>
