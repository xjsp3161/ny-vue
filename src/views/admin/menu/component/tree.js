export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    treeNodeClick(data, node, tree) {
      // this.$setOriginalKV(this.form, data)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    append(data) {
      this.currentOperationTypes = this.OperationTypes.Add
      this.form = this.$copy(this.originalForm)
      this.$setKeyValue(this.form, { parentId: data.id, parentName: data.title, level: data.level + 1, enable: '1' })
      // data.children.push(newChild)
    },
    edit(data) {
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    renderContent(h, { node, data, store }) {
      if (data.children && data.children.length > 0) {
        return (
          <span style='width:100%'>
            <span style='float:left; line-height:26px;'>{node.label}</span>
            <span style='float:right; margin-right:5px;'>
              <el-button size='mini' type='text' on-click={ () => this.append(data) }>添加</el-button>
              <el-button size='mini' type='text' on-click={ () => this.edit(data) }>编辑</el-button>
            </span>
          </span>
        )
      } else {
        return (
          <span style='width:100%'>
            <span style='float:left; line-height:26px;'>{node.label}</span>
            <span style='float:right; margin-right:5px;'>
              <el-button size='mini' type='text' on-click={ () => this.append(data) }>添加</el-button>
              <el-button size='mini' type='text' on-click={ () => this.edit(data) }>编辑</el-button>
              <el-button size='mini' type='text' on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>
        )
      }
    }
  }
}
