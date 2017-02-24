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

export function addCate({ payload }) {
  return request(`/haierp1/category/add${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};

export function queryCateList({ payload }) {
  return request(`/haierp1/category/queryCateList${toForm(payload)}`, {
    method: 'POST',
    credentials: true,
  });
};
