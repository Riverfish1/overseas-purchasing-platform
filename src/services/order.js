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

export function addOrder({ payload }) {
  return fetch.post(`/haierp1/order/add${toForm(payload)}`).catch(e => e);
}

export function updateOrder({ payload }) {
  return fetch.post(`/haierp1/order/update${toForm(payload)}`).catch(e => e);
}

export function queryOrderList({ payload }) {
  return fetch.post(`/haierp1/order/queryOrderList${toForm(payload)}`).catch(e => e);
}

export function queryOrder({ payload }) {
  return fetch.post(`/haierp1/order/query${toForm(payload)}`).catch(e => e);
}

export function querySalesName({ payload }) {
  return fetch.post(`/haierp1/order/querySalesName${toForm(payload)}`).catch(e => e);
}
