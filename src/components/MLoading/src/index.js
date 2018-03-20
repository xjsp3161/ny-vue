import Vue from 'vue'
import loadingVue from './loading.vue'
import {
  addClass,
  removeClass,
  getStyle
} from 'element-ui/src/utils/dom'
import merge from 'element-ui/src/utils/merge'

const LoadingConstructor = Vue.extend(loadingVue)

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customClass: ''
}

let fullscreenLoading

LoadingConstructor.prototype.originalPosition = ''
LoadingConstructor.prototype.originalOverflow = ''

LoadingConstructor.prototype.close = () => {
  if (this.fullscreen) {
    fullscreenLoading = undefined
  }
  this.$on('after-leave', _ => {
    const target = this.fullscreen || this.body ? document.body : this.target
    removeClass(target, 'el-loading-parent--relative')
    removeClass(target, 'el-loading-parent--hidden')
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    this.$destroy()
  })
  this.visible = false
}

LoadingConstructor.prototype.error = (text, refreshFn) => {
  this.spinner = false
  this.text = text
  this.textColor = 'red'
  this.refresh = true
  this.$on('refresh', () => {
    if (refreshFn) refreshFn()
  })
}

const addStyle = (options, parent, instance) => {
  const maskStyle = {}
  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position')
    instance.originalOverflow = getStyle(document.body, 'overflow')
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position')
  } else {
    instance.originalPosition = getStyle(parent, 'position')
  }
  Object.keys(maskStyle).forEach(property => {
    instance.$el.style[property] = maskStyle[property]
  })
}

const MLoading = (options = {}) => {
  if (Vue.prototype.$isServer) return
  options = merge({}, defaults, options)
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target)
  }
  options.target = options.target || document.body
  if (options.target !== document.body) {
    options.fullscreen = false
  } else {
    options.body = true
  }
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading
  }

  const parent = options.body ? document.body : options.target
  const instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  })

  addStyle(options, parent, instance)
  if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
    addClass(parent, 'el-loading-parent--relative')
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden')
  }
  parent.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })
  if (options.fullscreen) {
    fullscreenLoading = instance
  }
  return instance
}

export default MLoading
