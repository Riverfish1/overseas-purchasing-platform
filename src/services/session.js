import fetch from '../utils/request';

export function login({ payload }) {
  return fetch.post('/haierp1/haiLogin/login', { data: payload }).catch(e => e);
}
