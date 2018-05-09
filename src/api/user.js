import request from '@/utils/request'

const url = 'admin/api/sysUser'

export function fetchList(query) {
  return request({
    url: url,
    method: 'get',
    params: query
  })
}

export function crud(method, params) {
  const methods = ['get', 'delete']
  const key = methods.includes(method) ? 'params' : 'data'
  return request({
    url: url,
    method: method,
    [key]: params
  })
}

export function checkNameOrCodeExist(query) {
  return request({
    url: 'foundation/v1.0/api/goodsBranch/exists',
    method: 'GET',
    params: query
  })
}
