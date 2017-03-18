import fetch from '../utils/request';

export function addPurchase({ payload }) {
  return fetch.post('/haierp1/purchase/add', { data: payload }).catch(e => e);
}

export function updatePurchase({ payload }) {
  return fetch.post('/haierp1/purchase/update', { data: payload }).catch(e => e);
}

export function queryPurchaseList({ payload }) {
  return fetch.post('/haierp1/purchase/queryTaskDailyList', { data: payload }).catch(e => e);
}

export function queryPurchase({ payload }) {
  return fetch.post('/haierp1/purchase/query', { data: payload }).catch(e => e);
}

export function queryBuyers() {
  return fetch.post('/haierp1/purchase/queryBuyers').catch(e => e);
}

export function deletePurchase({ payload }) {
  return fetch.post('/haierp1/purchase/delete', { data: payload }).catch(e => e);
}
