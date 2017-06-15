import { message } from 'antd';
import fetch from '../utils/request';

const queryAgencyList = ({ payload }) => fetch.post('/haierp1/seller/querySellerList', { data: payload }).catch(e => e);
const queryAgency = ({ payload }) => fetch.post('/haierp1/seller/query', { data: payload }).catch(e => e);
const deleteAgency = ({ payload }) => fetch.post('/haierp1/seller/delete', { data: payload }).catch(e => e);
const updateAgency = ({ payload }) => fetch.post('/haierp1/seller/update', { data: payload }).catch(e => e);
const addAgency = ({ payload }) => fetch.post('/haierp1/seller/add', { data: payload }).catch(e => e);
const queryAgencyTypeList = ({ payload }) => fetch.post('/haierp1/sellerType/querySellerTypeList', { data: payload }).catch(e => e);
const queryAgencyType = ({ payload }) => fetch.post('/haierp1/sellerType/query', { data: payload }).catch(e => e);
const deleteAgencyType = ({ payload }) => fetch.post('/haierp1/sellerType/delete', { data: payload }).catch(e => e);
const updateAgencyType = ({ payload }) => fetch.post('/haierp1/sellerType/update', { data: payload }).catch(e => e);
const addAgencyType = ({ payload }) => fetch.post('/haierp1/sellerType/add', { data: payload }).catch(e => e);

export default {
  namespace: 'agency',
  state: {
    typeList: [],
    list: [],
    agencyValues: {},
    agencyTypeValues: {},
    total: 1,
    typeTotal: 1,
    current: 1,
    typeCurrent: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/person/agencyType') {
          dispatch({
            type: 'queryAgencyTypeList',
            payload: { pageIndex: 1 },
          });
        }
        if (pathname === '/person/agencyList') {
          dispatch({ type: 'queryAgencyList', payload: { pageIndex: 1 } });
          dispatch({ type: 'queryAgencyTypeList', payload: { pageIndex: 1 } });
        }
      });
    },
  },
  effects: {
    * queryAgencyList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ agency }) => agency.current);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(queryAgencyList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateList', payload: data });
      }
    },
    * queryAgency({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryAgency, { payload });
      if (data.success) {
        yield put({
          type: 'saveAgency',
          payload: data,
        });
      }
    },
    * addAgency({ payload }, { call, put }) {
      const data = yield call(addAgency, { payload });
      if (data.success) {
        message.success('新增类别成功');
        yield put({
          type: 'queryAgencyList',
          payload: {},
        });
      }
    },
    * deleteAgency({ payload }, { call, put, select }) {
      const data = yield call(deleteAgency, { payload });
      if (data.success) {
        message.success('删除类目成功');
        const agency = yield select(model => model.agency);
        if (agency.list.length < 2 && agency.current > 1) {
          yield put({
            type: 'queryAgencyList',
            payload: { payload: agency.current - 1 },
          });
          return;
        }
        yield put({
          type: 'queryAgencyList',
          payload: {},
        });
      }
    },
    * updateAgency({ payload }, { call, put }) {
      const data = yield call(updateAgency, { payload });
      if (data.success) {
        message.success('修改类目成功');
        yield put({
          type: 'queryAgencyList',
          payload: {},
        });
      }
    },
    * queryAgencyTypeList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ agency }) => agency.typeCurrent);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveTypeCurrentPage', payload });
      }
      const data = yield call(queryAgencyTypeList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateTypeList', payload: data });
      }
    },
    * queryAgencyType({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryAgencyType, { payload });
      if (data.success) {
        yield put({
          type: 'saveAgencyType',
          payload: data,
        });
      }
    },
    * addAgencyType({ payload }, { call, put }) {
      const data = yield call(addAgencyType, { payload });
      if (data.success) {
        message.success('新增类别成功');
        yield put({
          type: 'queryAgencyTypeList',
          payload: {},
        });
      }
    },
    * deleteAgencyType({ payload }, { call, put, select }) {
      const data = yield call(deleteAgencyType, { payload });
      if (data.success) {
        message.success('删除类目成功');
        const agency = yield select(model => model.agency);
        if (agency.typeList.length < 2 && agency.typeCurrent > 1) {
          yield put({
            type: 'queryAgencyTypeList',
            payload: { pageIndex: agency.typeCurrent - 1 },
          });
          return;
        }
        yield put({
          type: 'queryAgencyTypeList',
          payload: {},
        });
      }
    },
    * updateAgencyType({ payload }, { call, put }) {
      const data = yield call(updateAgencyType, { payload });
      if (data.success) {
        message.success('修改类目成功');
        yield put({
          type: 'queryAgencyTypeList',
          payload: {},
        });
      }
    },
  },
  reducers: {
    updateTypeList(state, { payload }) {
      return { ...state, typeList: payload.data, typeTotal: payload.totalCount };
    },
    saveAgencyType(state, { payload }) {
      return { ...state, agencyTypeValues: payload.data };
    },
    updateList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    saveAgency(state, { payload }) {
      return { ...state, agencyValues: payload };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, current: payload.pageIndex };
    },
    saveTypeCurrentPage(state, { payload }) {
      return { ...state, typeCurrent: payload.pageIndex };
    },
  },
};
