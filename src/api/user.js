import request from '@/utils/request'

const url = '/admin/api/sysUser'

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

export function fetchUserMenuTree(query) {
  return request({
    url: '/admin/api/sysUser/userMenuTree',
    method: 'get',
    params: query
  })
}

export function checkUserNameIsExist(query) {
  return request({
    url: '/admin/api/sysUser/checkUserNameIsExist',
    method: 'GET',
    params: query
  })
}

export function fetchRoleNoExistUsers(query) {
  return request({
    url: '/admin/api/sysUser/roleNoExistUsers',
    method: 'GET',
    params: query
  })
}

export function fetchRoleUsers(query) {
  return request({
    url: '/admin/api/sysUser/roleUsers',
    method: 'GET',
    params: query
  })
}
