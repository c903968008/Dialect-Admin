import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/administrator',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/administrator/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/administrator/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/administrator/delete',
    method: 'post',
    data
  })
}
