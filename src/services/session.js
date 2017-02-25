import fetch from '../utils/request';

function toForm(data) {
  let str = '?';
  Object.keys(data).forEach((el, index) => {
    if (index > 0) str += '&';
    str += `${el}=${data[el]}`;
  });
  return str;
}

export function login({ payload }) {
  return fetch.post(`/haierp1/haiLogin/login${toForm(payload)}`).catch(e => e);
}
