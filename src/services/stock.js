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
  return fetch.post(`/haierp1/pur/add${toForm(payload)}`).catch(e => e);
}

export function updateOrder({ payload }) {
  return fetch.post(`/haierp1/pur/update${toForm(payload)}`).catch(e => e);
}

export function queryStockList({ payload }) {
  return fetch.post(`/haierp1/pur/queryStockList${toForm(payload)}`).catch(e => e);
}

export function queryOrder({ payload }) {
  return fetch.post(`/haierp1/pur/query${toForm(payload)}`).catch(e => e);
}

export function querySalesName({ payload }) {
  return fetch.post(`/haierp1/pur/querySalesName${toForm(payload)}`).catch(e => e);
}
