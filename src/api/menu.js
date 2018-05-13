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
  if (methods.indexOf(method) >= 0) {
    return request({
      url: '/admin/api/sysMenu/' + params.id,
      method: method
    })
  } else {
    return request({
      url: '/admin/api/sysMenu',
      method: method,
      [key]: params
    })
  }
}
