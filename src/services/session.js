import request from '../utils/request';
import { API_URL } from '../constants';

function toForm(data) {
  let str = '?';
  Object.keys(data).forEach((el, index) => {
    if (index > 0) str += '&';
    str += `${el}=${data[el]}`;
  });
  return str;
}

export function login({ payload }) {
  return request(`${API_URL}/login${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
}
