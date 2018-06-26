import parent from '@/public/parent.js'
import addModel from '@/public/addModel.js'
import { fetch } from '@/api/index.js'
const cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  name: 'resource-dialog',
  mixins: [parent, addModel],
  data() {
    return {
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true,
      resourceTree: []
    }
  },
  created() {
    this.createDefaultMLoading('.el-dialog')
    this.dialog = { title: '关联资源', visiable: true }
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
          if (element.checked === true) {
            element.checked = true
          } else {
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
        console.log(data)
      }).catch(error => {
        this.mloading.error(error.message, () => {
          this.fetchData()
        })
      })
    },
    handleCheckAllChange(checked, item) {
      item.indeterminate = false
      console.log(item)
    },
    handleCheckChange(checked, item, sub) {
      console.log(checked, item, sub)
    },
    closeDialog() {
      this.$emit('input', false)
    }
  }
}
