import fetch from '../utils/request';

export function queryAgencyTypeList({ payload }) {
  fetch.post('/haierp1/agency/agencyTypeList', { data: payload }).catch(e => e);
}

export function queryAgencyType({ payload }) {
  fetch.post('/haierp1/agency/queryAgencyType', { data: payload }).catch(e => e);
}

export function deleteAgencyType({ payload }) {
  fetch.post('/haierp1/agency/deleteType', { data: payload }).catch(e => e);
}

export function updateAgencyType({ payload }) {
  fetch.post('/haierp1/agency/updateType', { data: payload }).catch(e => e);
}

export function addAgencyType({ payload }) {
  fetch.post('/haierp1/agency/addType', { data: payload }).catch(e => e);
}
