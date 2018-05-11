import request from '@/utils/request'

export function fetchMenuTree(query) {
  return request({
    url: '/admin/api/sysMenu/tree',
    method: 'get',
    params: query
  })
}

export function curdMenu(method, params) {
  const methods = ['get', 'delete']
  const key = methods.includes(method) ? 'params' : 'data'
  return request({
    url: '/admin/api/sysMenu',
    method: method,
    [key]: params
  })
}
