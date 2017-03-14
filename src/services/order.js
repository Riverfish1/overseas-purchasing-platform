import fetch from '../utils/request';

export function addOrder({ payload }) {
  return fetch.post('/haierp1/order/add', { data: payload }).catch(e => e);
}

export function updateOrder({ payload }) {
  return fetch.post('/haierp1/order/update', { data: payload }).catch(e => e);
}

export function deleteOrder({ payload }) {
  return fetch.post('/haierp1/order/delete', { data: payload }).catch(e => e);
}

export function queryOrderList({ payload }) {
  return fetch.post('/haierp1/order/queryOrderList', { data: payload }).catch(e => e);
}

export function queryOrder({ payload }) {
  return fetch.post('/haierp1/order/query', { data: payload }).catch(e => e);
}

export function querySalesName({ payload }) {
  return fetch.post('/haierp1/order/querySalesName', { data: payload }).catch(e => e);
}
