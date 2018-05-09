import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username: username,
    password: password,
    grant_type: 'password',
    client: 'frontend'
  }
  return request({
    url: '/login/oauth/token',
    method: 'post',
    params: data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: 'frontend',
      password: 'frontend'
    }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

