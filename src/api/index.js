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

export function fetchInfo(url, id) {
  return request({
    url: url + '/' + id,
    method: 'get'
  })
}

export function deleteInfo(url, id) {
  return request({
    url: url + '/' + id,
    method: 'delete'
  })
}

