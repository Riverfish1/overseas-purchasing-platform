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

export function addPurchase({ payload }) {
  return fetch.post(`/haierp1/purchase/add${toForm(payload)}`).catch(e => e);
}

export function updatePurchase({ payload }) {
  return fetch.post(`/haierp1/purchase/update${toForm(payload)}`).catch(e => e);
}

export function queryPurchaseList({ payload }) {
  return fetch.post(`/haierp1/purchase/queryPurchaseList${toForm(payload)}`).catch(e => e);
}

export function queryPurchase({ payload }) {
  return fetch.post(`/haierp1/purchase/query${toForm(payload)}`).catch(e => e);
}

export function queryBuyer({ payload }) {
  return fetch.post(`/haierp1/purchase/queryBuyer${toForm(payload)}`).catch(e => e);
}
