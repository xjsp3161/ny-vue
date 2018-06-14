import request from '@/utils/request'

export function noRelation(query) {
  return request({
    url: '/admin/api/sysPermissionMenu/permissionNoRelationMenuTree',
    method: 'get',
    params: query
  })
}

export function relation(query) {
  return request({
    url: '/admin/api/sysPermissionMenu/permissionMenuTree',
    method: 'get',
    params: query
  })
}

export function batchSave(params) {
  return request({
    url: '/admin/api/sysPermissionMenu/batchAdd',
    method: 'post',
    data: params
  })
}

export function batchDelete(params) {
  return request({
    url: '/admin/api/sysPermissionMenu/batchDelete',
    method: 'post',
    data: params
  })
}
