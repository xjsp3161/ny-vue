import request from '@/utils/request'

export function fetchList(url, query) {
  return request({
    url: url,
    method: 'get',
    params: query
  })
}

export function crud(url, method, params) {
  const methods = ['get', 'delete']
  const key = methods.includes(method) ? 'params' : 'data'
  return request({
    url: url,
    method: method,
    [key]: params
  })
}

