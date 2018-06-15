import { curdMenu } from '@/api/menu.js'
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    treeNodeClick(data, node, tree) {
      if (!this.isCluckOperationBtn) {
        this.$setOriginalKV(this.form, data)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    append(data) {
      this.isCluckOperationBtn = true
      this.currentOperationTypes = this.OperationTypes.Add
      this.form = this.$copy(this.originalForm)
      this.$setKeyValue(this.form, { parentId: data.id, parentName: data.title, level: data.level + 1, enable: '1' })
      setTimeout(() => {
        this.isCluckOperationBtn = false
      }, 200)
    },
    edit(data) {
    },
    remove(node, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        curdMenu('delete', { id: data.id }).then(() => {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
          this.$message({ type: 'success', message: '删除成功!' })
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败!' })
        })
      }).catch(() => {})
    },
    renderContent(h, { node, data, store }) {
      if (data.children && data.children.length > 0) {
        return (
          <span style='width:100%'>
            <span style='float:left; padding-top:8px;'>{node.label}</span>
            <span style='float:right; margin-right:5px;'>
              <el-button size='mini' type='text' on-click={ () => this.append(data) }>添加</el-button>
              <el-button size='mini' type='text' on-click={ () => this.edit(data) }>编辑</el-button>
            </span>
          </span>
        )
      } else {
        return (
          <span style='width:100%'>
            <span style='float:left; padding-top:8px;'>{node.label}</span>
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
