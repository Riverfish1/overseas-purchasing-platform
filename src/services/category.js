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
  return fetch.post(`/haierp1/category/queryList${toForm(payload)}`).catch(e => e);
}

export function queryCate({ payload }) {
  return fetch.post(`/haierp1/category/query${toForm(payload)}`).catch(e => e);
}

export function updateCate({ payload }) {
  return fetch.post(`/haierp1/category/update${toForm(payload)}`).catch(e => e);
}

export function deleteCate({ payload }) {
  return fetch.post(`/haierp1/category/delete${toForm(payload)}`).catch(e => e);
}
