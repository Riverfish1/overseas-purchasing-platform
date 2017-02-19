import request from '../utils/request';
import { PAGE_SIZE } from '../constants';

function toForm(data) {
  let str = '?';
  Object.keys(data).forEach((el, index) => {
    if (index > 0) str += '&';
    str += `${el}=${data[el]}`;
  });
  return str;
}

export function queryProductTable({ payload }) {
  return request(`/mock/products${toForm(payload)}`);
}

export function queryItemList({ payload }) {
  return request(`item/queryItemList${toForm(payload)}`);
}
