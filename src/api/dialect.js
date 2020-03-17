import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/dialect',
    method: 'get',
    params: query
  })
}

export function getOptionDialect(query) {
  return request({
    url: '/dialect/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/dialect/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dialect/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/dialect/delete',
    method: 'post',
    data
  })
}

export function audit(data) {
  return request({
    url: '/dialect/audit',
    method: 'post',
    data
  })
}

export function autoAudit(data) {
  return request({
    url: '/dialect/audit/auto',
    method: 'post',
    data
  })
}
