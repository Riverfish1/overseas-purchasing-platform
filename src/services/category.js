import fetch from '../utils/request';

export function addCate({ payload }) {
  return fetch.post('/haierp1/category/add', { data: payload }).catch(e => e);
}

export function queryCateList({ payload }) {
  return fetch.post('/haierp1/category/queryList', { data: payload }).catch(e => e);
}

export function queryCate({ payload }) {
  return fetch.post('/haierp1/category/query', { data: payload }).catch(e => e);
}

export function updateCate({ payload }) {
  return fetch.post('/haierp1/category/update', { data: payload }).catch(e => e);
}

export function deleteCate({ payload }) {
  return fetch.post('/haierp1/category/delete', { data: payload }).catch(e => e);
}
