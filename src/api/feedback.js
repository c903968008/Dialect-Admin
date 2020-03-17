import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/feedback',
    method: 'get',
    params: query
  })
}

export function deleteOne(data) {
  return request({
    url: '/feedback/delete',
    method: 'post',
    data
  })
}
