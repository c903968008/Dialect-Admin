import request from '@/utils/request'

export function getAll(query) {
  return request({
    url: '/district',
    method: 'get',
    params: query
  })
}

export function getList(query) {
  return request({
    url: '/district/all',
    method: 'get',
    params: query
  })
}

export function getOption(query) {
  return request({
    url: '/district/list',
    method: 'get',
    params: query
  })
}

export function getPrevious(query) {
  return request({
    url: '/district/previous',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/district/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/district/edit',
    method: 'post',
    data
  })
}

export function deleteOne(data) {
  return request({
    url: '/district/delete',
    method: 'post',
    data
  })
}
