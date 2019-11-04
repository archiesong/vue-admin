import request from '@/utils/request'

export function createUser(data) {
  return request({
    url: 'api/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'api/update',
    method: 'put',
    data
  })
}
