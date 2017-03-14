import fetch from '../utils/request';

export function queryItemList({ payload }) {
  return fetch.post('/haierp1/item/queryItemList', { data: payload }).catch(e => e);
}

export function queryProduct({ payload }) {
  return fetch.post('/haierp1/item/query', { data: payload }).catch(e => e);
}

export function updateProducts({ payload }) {
  return fetch.post('/haierp1/item/update', { data: payload }).catch(e => e);
}

export function addProducts({ payload }) {
  return fetch.post('/haierp1/item/add', { data: payload }).catch(e => e);
}

export function queryBrands() {
  return fetch.post('/haierp1/item/brand/queryBrands').catch(e => e);
}

export function queryCatesTree() {
  return fetch.post('/haierp1/category/tree').catch(e => e);
}

export function addSku({ payload }) {
  return fetch.post('/haierp1/sku/add', { data: payload }).catch(e => e);
}

export function addCate({ payload }) {
  return fetch.post('/haierp1/category/add', { data: payload }).catch(e => e);
}

export function querySkuList({ payload }) {
  return fetch.post('/haierp1/sku/querySkuList', { data: payload }).catch(e => e);
}

export function queryCateList({ payload }) {
  return fetch.post('/haierp1/cate/queryCateList', { data: payload }).catch(e => e);
}
