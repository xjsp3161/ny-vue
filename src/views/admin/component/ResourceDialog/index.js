import parent from '@/public/parent.js'
import addModel from '@/public/addModel.js'
import { fetch , crud } from '@/api/index.js'
export default {
  name: 'resource-dialog',
  mixins: [parent, addModel],
  data() {
    return {
      resourceTree: [],
      from: {
        permissionId: null,
        resourceIds: []
      }
    }
  },
  created() {
    this.createDefaultMLoading('.el-dialog')
    this.dialog = { title: '关联资源', visiable: true }
    this.button.text = '关联'
    this.from.permissionId = this.data.obj.id
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.mloading.show()
      fetch('/admin/api/sysPermission/permissionResourceTree', { permissionId: this.data.obj.id }).then(({ data }) => {
        this.mloading.hide()
        data.forEach(element => {
          element.indeterminate = false
          if (element.checked === false) {
            for (let i = 0; i < element.children.length; i++) {
              const item = element.children[i]
              if (item.checked === true) {
                element.indeterminate = true
                element.checked = false
                break
              }
            }
          }
        })
        this.resourceTree = data
      }).catch(error => {
        this.mloading.error(error.message, () => {
          this.fetchData()
        })
      })
    },
    handleCheckAllChange(checked, index, item) {
      item.indeterminate = false
      item.children.forEach(child => {
        child.checked = checked
      })
    },
    handleCheckChange(checked, item, sub) {
      let count = 0
      item.children.forEach(child => {
        if (child.checked) {
          ++ count
        }
      })
      if (count === 0) {
        item.checked = false
        item.indeterminate = false
      } else if (count === item.children.length) {
        item.checked = true
        item.indeterminate = false
      } else {
        item.checked = false
        item.indeterminate = true
      }
    },
    closeDialog() {
      this.$emit('input', false)
    },
    clickSave() {
      let resourceIds = []
      this.resourceTree.forEach(item => {
        if (item.checked) {
          resourceIds.push(item.id)
        }
        item.children.forEach(child => {
          if (child.checked) {
            resourceIds.push(child.id)
          }
        })
      })
      this.from.resourceIds = resourceIds
      crud('/admin/api/sysPermission/batchResourceAdd', 'post', this.from).then(() => {
        this.$message({type: 'error', message: '资源关联成功'})
      }).catch(() => {
        this.$message({type: 'error', message: '资源关联失败'})
      })
    }
  }
}
