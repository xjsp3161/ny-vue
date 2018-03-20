import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/brand',
    method: 'get',
    params: query
  })
}
