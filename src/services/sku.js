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

export function addSku({ payload }) {
  return fetch.post(`/haierp1/itemSku/add${toForm(payload)}`).catch(e => e);
}

export function updateSku({ payload }) {
  return fetch.post(`/haierp1/itemSku/update${toForm(payload)}`).catch(e => e);
}

export function querySku({ payload }) {
  return fetch.post(`/haierp1/itemSku/query${toForm(payload)}`).catch(e => e);
}

export function querySkuList({ payload }) {
  return fetch.post(`/haierp1/itemSku/queryItemSkuList${toForm(payload)}`).catch(e => e);
}

export function deleteSku({ payload }) {
  return fetch.post(`/haierp1/itemSku/delete${toForm(payload)}`).catch(e => e);
}

export function queryPackageScales() {
  return fetch.post('/haierp1/freight/getPackageScaleList').catch(e => e);
}

export function queryScaleTypes() {
  return fetch.post('/haierp1/itemSku/scaleTypeList').catch(e => e);
}
