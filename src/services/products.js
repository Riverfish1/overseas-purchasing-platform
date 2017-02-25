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

export function queryItemList({ payload }) {
  return request(`/haierp1/item/queryItemList${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};


export function queryProduct({ payload }) {
  return request(`/haierp1/item/query${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function updateProducts({ payload }) {
  return request(`/haierp1/item/update${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function addProducts({ payload }) {
  return request(`/haierp1/item/add${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};


export function queryBrands() {
  return request('/haierp1/item/brand/queryBrands', {
    method: 'POST',
    credentials: true,
  });
};

export function queryCatesTree() {
  return request('/haierp1/category/tree', {
    credentials: true,
  });
};

