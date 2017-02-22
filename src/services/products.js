import request from '../utils/request';
import { BASE_URL } from '../constants';

function toForm(data) {
  let str = '?';
  Object.keys(data).forEach((el, index) => {
    if (index > 0) str += '&';
    str += `${el}=${data[el]}`;
  });
  return str;
}

export function addProducts({ payload }) {
  return request(`${BASE_URL}/item/add${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    },
  });
}

export function queryItemList({ payload }) {
  return request(`${BASE_URL}/item/queryItemList${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    },
  });
}
