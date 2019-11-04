import request from '@/utils/request'

export function fetchDepts(deptName) {
  return request({
    url: 'api/dept',
    method: 'get',
    params: { deptName }
  })
}
