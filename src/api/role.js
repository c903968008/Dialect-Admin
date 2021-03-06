import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/role',
    method: 'get',
    params: query
  })
}

export function getOption() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/role/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}
