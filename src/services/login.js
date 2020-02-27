import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function userLogin (params) {
  return request('/api/users/login', {
    method: 'POST',
    data: params
  })
}

export async function userCurrentLogin () {
  return request('/api/users/me')
}

export async function userLogout (params) {
  return request('/api/users/me/logout', { method: 'POST' })
}

export async function userLogoutAll () {
  return request('/api/users/me/logoutall', { method: 'POST' })
}