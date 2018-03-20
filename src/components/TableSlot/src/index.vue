<template>
  <div>
		<slot name="table"></slot>
    <slot name="footer"></slot>
	</div>
</template>

<script>
export default {
  name: 'TableSlot',
  props: {
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    this.updateHeight()
    window.addEventListener('resize', this.updateHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateHeight)
  },
  methods: {
    resizeHeight() {
      setTimeout(() => {
        this.updateHeight()
      }, 100)
    },
    updateHeight() {
      const table = this.$slots.table[0]
      const footer = this.$slots.footer && this.$slots.footer[0]
      const tabs = document.getElementsByClassName('el-tabs_header')
      const currentHeight = window.innerHeight
      const top = table.elm.getBoundingClientRect().top
      const footerHeight = footer && footer.elm.getBoundingClientRect().height || 0
      const marginTop = footer && parseInt(getComputedStyle(footer.elm).marginTop) || 0
      const marginBottom = footer && parseInt(getComputedStyle(footer.elm).marginBottom) || 0
      let tabsHeight = 0
      if (tabs.length > 0) {
        tabsHeight = tabs && parseInt(getComputedStyle(tabs[0]).height)
      }
      if (top === 0 || tabsHeight === 1) {
        if (this.count <= 100) {
          setTimeout(() => {
            this.updateHeight()
            this.count++
          }, 100)
        }
      }
      const maxHeight = (currentHeight - top - footerHeight - marginTop - marginBottom)
      if (table.tag.indexOf('ELTable') !== -1) {
        this.elm.style.maxHeight = maxHeight + 'px'
        let headHeight = null
        for (let i = 0; i < table.elm.childred.length; i++) {
          const child = table.elm.childred[i]
          if (child.className === 'el-table__header-wrapper') {
            headHeight = child.offsetHeight
          }
          if (child.className === 'el-table__body-wrapper') {
            if (headHeight) {
              child.style.maxHeight = maxHeight - headHeight + tabsHeight + 'px'
            }
          }
        }
      } else {
        table.children[0].elm.style.maxHeight = maxHeight + 'px'
        let headHeight = null
        for (let i = 0; i < table.children[0].elm.children.length; i++) {
          const child = table.children[0].elm.children
          if (child.className === 'el-table__header-wrapper') {
            headHeight = child.offsetHeight
          }
          if (child.className === 'el-table__body-wrapper') {
            if (headHeight) {
              child.style.maxHeight = maxHeight - headHeight + tabsHeight + 'px'
            }
          }
        }
      }
      this.$emit('update:height', maxHeight)
    }
  }
}
</script>

