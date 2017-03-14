import fetch from '../utils/request';

export function addSku({ payload }) {
  return fetch.post('/haierp1/itemSku/add', { data: payload }).catch(e => e);
}

export function updateSku({ payload }) {
  return fetch.post('/haierp1/itemSku/update', { data: payload }).catch(e => e);
}

export function querySku({ payload }) {
  return fetch.post('/haierp1/itemSku/query', { data: payload }).catch(e => e);
}

export function querySkuList({ payload }) {
  return fetch.post('/haierp1/itemSku/queryItemSkuList', { data: payload }).catch(e => e);
}

export function deleteSku({ payload }) {
  return fetch.post('/haierp1/itemSku/delete', { data: payload }).catch(e => e);
}

export function queryPackageScales() {
  return fetch.post('/haierp1/freight/getPackageScaleList').catch(e => e);
}

export function queryScaleTypes() {
  return fetch.post('/haierp1/itemSku/scaleTypeList').catch(e => e);
}
