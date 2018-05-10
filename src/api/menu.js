import request from '@/utils/request'

export function fetchMenuTree(query) {
  return request({
    url: '/admin/api/sysMenu/tree',
    method: 'get',
    params: query
  })
}
