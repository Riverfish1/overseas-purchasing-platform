import request from '../utils/request';

function toForm(data) {
  let str = '?';
  Object.keys(data).forEach((el, index) => {
    if (data[el]) {
      str += '&';
      str += `${el}=${data[el]}`;
    }
  });
  return str;
}

export function addSku({ payload }) {
  return request(`/haierp1/sku/add${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function querySkuList({ payload }) {
  return request(`/haierp1/sku/querySkuList${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};
