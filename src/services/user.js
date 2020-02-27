import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function userQueryBy (params) {
  return request('/api/users', {
    params
  })
}

export async function userCreateBy (params) {
  return request('/api/users/create', {
    method: 'POST',
    data: params
  })
}

export async function userUpdateBy (params) {
  return request('/api/users/update', {
    method: 'PUT',
    params
  })
}

export async function userDeleteBy (params) {
  return request('/api/users/delete', {
    method: 'DELETE',
    params
  })
}