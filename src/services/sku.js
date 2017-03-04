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

export function querySkuList({ payload }) {
  return fetch.post(`/haierp1/itemSku/queryItemSkuList${toForm(payload)}`).catch(e => e);
}
