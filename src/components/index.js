import Vue from 'vue'
import MLoading from './MLoading/index'
import TableSlot from './TableSlot/index'
import Api from './Api/api'

const components = [
  TableSlot
]

const install = (Vue, opts) => {
  components.map(component => {
    Vue.component(component.name, component)
  })
  var api = new Api()
  Vue.prototype.$api = api
  Vue.prototype.$mloading = MLoading.service
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

Vue.use(install)
