import request from '@/utils/request'

export function showConfig(query) {
  return request({
    url: '/dashboard/config/show',
    method: 'get',
    params: query
  })
}

export function editConfig(query) {
  return request({
    url: '/dashboard/config/edit',
    method: 'get',
    params: query
  })
}

export function count(query) {
  return request({
    url: '/dashboard/count',
    method: 'get',
    params: query
  })
}

export function rank(query) {
  return request({
    url: '/dashboard/rank',
    method: 'get',
    params: query
  })
}

export function rankByDistrict(query) {
  return request({
    url: '/dashboard/district/rank',
    method: 'get',
    params: query
  })
}