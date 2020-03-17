import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/get_info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getAll(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function deleteOne(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
