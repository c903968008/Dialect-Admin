import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/permission',
    method: 'get',
    params: query
  })
}

export function getOption() {
  return request({
    url: '/permission/list',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/permission/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/permission/delete',
    method: 'post',
    data
  })
}
