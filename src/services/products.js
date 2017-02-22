import request from '../utils/request';

function toForm(data) {
  let str = '?';
  Object.keys(data).forEach((el, index) => {
    if (index > 0) str += '&';
    str += `${el}=${data[el]}`;
  });
  return str;
}

export function addProducts({ payload }) {
  return request(`/item/add${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function addSku({ payload }) {
  return request(`/sku/add${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function addCate({ payload }) {
  return request(`/cate/add${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function queryItemList({ payload }) {
  return request(`/item/queryItemList${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
    mode: 'no-cors',
  });
};

export function querySkuList({ payload }) {
  return request(`/sku/querySkuList${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function queryCateList({ payload }) {
  return request(`/cate/queryCateList${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

