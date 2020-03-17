import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/question',
    method: 'get',
    params: query
  })
}

export function show(query) {
  return request({
    url: '/question/show',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/question/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/question/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/question/delete',
    method: 'post',
    data
  })
}
