import fetch from '../utils/request';

export function queryAgencyList({ payload }) {
  fetch.post('/haierp1/seller/querySellerList', { data: payload }).catch(e => e);
}

export function queryAgency({ payload }) {
  fetch.post('/haierp1/seller/query', { data: payload }).catch(e => e);
}

export function deleteAgency({ payload }) {
  fetch.post('/haierp1/seller/delete', { data: payload }).catch(e => e);
}

export function updateAgency({ payload }) {
  fetch.post('/haierp1/seller/update', { data: payload }).catch(e => e);
}

export function addAgency({ payload }) {
  fetch.post('/haierp1/seller/add', { data: payload }).catch(e => e);
}

export function queryAgencyTypeList({ payload }) {
  fetch.post('/haierp1/sellerType/querySellerTypeList', { data: payload }).catch(e => e);
}

export function queryAgencyType({ payload }) {
  fetch.post('/haierp1/sellerType/query', { data: payload }).catch(e => e);
}

export function deleteAgencyType({ payload }) {
  fetch.post('/haierp1/sellerType/delete', { data: payload }).catch(e => e);
}

export function updateAgencyType({ payload }) {
  fetch.post('/haierp1/sellerType/update', { data: payload }).catch(e => e);
}

export function addAgencyType({ payload }) {
  fetch.post('/haierp1/sellerType/add', { data: payload }).catch(e => e);
}
