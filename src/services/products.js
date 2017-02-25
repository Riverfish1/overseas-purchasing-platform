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

export function queryItemList({ payload }) {
  return fetch.post(`/haierp1/item/queryItemList${toForm(payload)}`).catch(e => e);
}

export function queryProduct({ payload }) {
  return fetch.post(`/haierp1/item/query${toForm(payload)}`).catch(e => e);
}

export function updateProducts({ payload }) {
  return fetch.post(`/haierp1/item/update${toForm(payload)}`).catch(e => e);
}

export function addProducts({ payload }) {
  return fetch.post(`/haierp1/item/add${toForm(payload)}`).catch(e => e);
}

export function queryBrands() {
  return fetch.post('/haierp1/item/brand/queryBrands').catch(e => e);
}

export function queryCatesTree() {
  return fetch.post('/haierp1/category/tree').catch(e => e);
}

export function addSku({ payload }) {
  return fetch.post(`/haierp1/sku/add${toForm(payload)}`).catch(e => e);
}

export function addCate({ payload }) {
  return fetch.post(`/haierp1/category/add${toForm(payload)}`).catch(e => e);
}

export function querySkuList({ payload }) {
  return fetch.post(`/haierp1/sku/querySkuList${toForm(payload)}`).catch(e => e);
}

export function queryCateList({ payload }) {
  return fetch.post(`/haierp1/cate/queryCateList${toForm(payload)}`).catch(e => e);
}
