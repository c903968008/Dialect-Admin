import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/certificate',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/certificate/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/certificate/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/certificate/delete',
    method: 'post',
    data
  })
}
