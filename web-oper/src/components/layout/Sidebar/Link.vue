
<template>
  <component :is="type" v-bind="linkProps(to)" @click.native="testClick">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/Validate'
export default {
  name: 'Link',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    testClick() {
      const { fullPath } = this.$route
      this.$router.replace({
        path: fullPath
      })
    },
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
