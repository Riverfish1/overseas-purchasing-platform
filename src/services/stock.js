import fetch from '../utils/request';

export function addOrder({ payload }) {
  return fetch.post('/haierp1/pur/add', { data: payload }).catch(e => e);
}

export function updateOrder({ payload }) {
  return fetch.post('/haierp1/pur/update', { data: payload }).catch(e => e);
}

export function queryStockList({ payload }) {
  return fetch.post('/haierp1/pur/queryStockList', { data: payload }).catch(e => e);
}

export function queryOrder({ payload }) {
  return fetch.post('/haierp1/pur/query', { data: payload }).catch(e => e);
}

export function querySalesName({ payload }) {
  return fetch.post('/haierp1/pur/querySalesName', { data: payload }).catch(e => e);
}
