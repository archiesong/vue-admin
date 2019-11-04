import request from '@/utils/request'

export function fetchJobs(queryParmas) {
  return request({
    url: 'api/job',
    method: 'get',
    params: queryParmas
  })
}
