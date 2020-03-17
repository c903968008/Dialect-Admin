import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/activity',
    method: 'get',
    params: query
  })
}

export function show(data) {
  return request({
    url: '/activity/show',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/activity/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/activity/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/activity/delete',
    method: 'post',
    data
  })
}
