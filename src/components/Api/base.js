import axios from 'axios'
import defaultConfig from './config.json'

/**
 * @author super
 * @description 封装 axios 中网络请求中常用的各种请求方式，以及一些通用的功能
 */
export default class Base {
  constructor(token) {
    if (token) {
      this.newAxios()
    } else {
      this.$http = this.newAxios(defaultConfig)
    }
    this.addInterceptors()
  }

  addInterceptors() {
    this.requestInterceptors()
    this.responseInterceptors()
  }

  requestInterceptors() {
    this.$http.interceptors.request.use(config => {
      if (config.url.indexOf('http') !== -1 || config.url.indexOf('https') !== -1) {
        delete config.headers.Authorization
        delete config.headers.user_identity
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
  }

  responseInterceptors() {
    this.$http.interceptors.response.use(
      response => {
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  newAxios(config) {
    if (config) {
      return axios.create(null)
    } else {
      return axios.create({
        headers: config.headers,
        timeout: config.timeout
      })
    }
  }

  getDefaultConfig() {
    return defaultConfig
  }

  getAxios() {
    return axios
  }

  setToken(token) {
    if (token) {
      defaultConfig.headers.Authorization = token
      this.$http = this.newAxios(defaultConfig)
    }
    this.addInterceptors()
  }

  get(url, params) {
    return new Promise((resolve, reject) => {
      this.$http.get(self.appendDomain(url), { params: params })
        .then(response => {
          resolve(self.handleSuccess(response))
        })
        .catch(error => {
          reject(self.handleError(error))
        })
    })
  }

  post(url, params) {
    return new Promise((resolve, reject) => {
      this.$http.post(self.appendDomain(url), params)
        .then(response => {
          resolve(self.handleSuccess(response))
        }).catch(error => {
          reject(self.handleError(error))
        })
    })
  }

  put(url, params) {
    return new Promise((resolve, reject) => {
      this.$http.put(self.appendDomain(url), params)
        .then(response => {
          resolve(self.handleSuccess(response))
        }).catch(error => {
          reject(self.handleError(error))
        })
    })
  }

  putUrl(url, params) {
    const requestUrl = this.appendDomain(url) + this.urlParams(params)
    return new Promise((resolve, reject) => {
      this.$http.put(requestUrl, null).then(response => {
        resolve(this.handleSuccess(response))
      }).catch(error => {
        reject(this.handleError(error))
      })
    })
  }

  delete(url, params) {
    return new Promise((resolve, reject) => {
      self.$http.delete(self.appendDomain(url), { params: params })
        .then(response => {
          resolve(self.handleSuccess(response))
        }).catch(error => {
          reject(self.handleError(error))
        })
    })
  }

  urlParams(params) {
    if (!params || params === null) return ''
    var paramStr = '?'
    for (var key in params) {
      paramStr += key + '=' + params[key] + '&'
    }
    paramStr = paramStr.substring(0, paramStr.length - 1)
    return paramStr
  }

  handleSuccess(response) {
    var data = response.data
    return {
      status: data.resultCode === 0 ? 1 : 0,
      data: data
    }
  }

  handleError(error) {
    var resp = {
      code: 0,
      message: null,
      random: Math.random() * 100
    }
    if (error.response) {
      if (error.response.status === 401) {
        window.postMessage('401', '*')
        resp.code = 401
      } else if (error.response.status === 500) {
        resp.code = 500
        resp.message = '服务器内部出错'
      } else if (error.response.status === 504) {
        resp.message = error.response.data
        resp.code = 504
      } else if (error.response.status === 502) {
        resp.message = '网关延时'
        resp.code = 502
      } else if (error.response.status === 503) {
        resp.message = '后台服务未开启'
        resp.code = 503
      }
    } else {
      resp.code = -1
      resp.message = error.message
    }
    return resp
  }

  appendDomain(url) {
    if (url.indexOf('/') !== -1) {
      var urls = url.split('/')
      if (urls && urls.length > 2 && urls[1] === 'api') {
        urls.splice(1, 0, 'v1.0')
        return urls.join('/')
      }
    }
    return defaultConfig.domain + '/v1.0/api/' + url
  }
}
