import fetch from '../utils/request';

function toForm(data) {
  let str = '?';
  Object.keys(data).forEach((el) => {
    if (data[el]) {
      str += '&';
      str += `${el}=${data[el]}`;
    }
  });
  return str;
}

export function addCate({ payload }) {
  return fetch.post(`/haierp1/category/add${toForm(payload)}`).catch(e => e);
}

export function queryCateList({ payload }) {
  return fetch.post(`/haierp1/category/queryCateList${toForm(payload)}`).catch(e => e);
}
