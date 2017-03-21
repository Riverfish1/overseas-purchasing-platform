import { message } from 'antd';
import {
  queryAgencyTypeList,
  queryAgencyType,
  deleteAgencyType,
  updateAgencyType,
  addAgencyType,
  queryAgencyList,
  queryAgency,
  deleteAgency,
  updateAgency,
  addAgency,
} from '../services/agency';

export default {
  namespace: 'agency',
  state: {
    typeList: [],
    list: [],
    agencyValues: {},
    agencyTypeValues: {},
    total: 1,
    typeTotal: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/person/agencyType') {
          dispatch({
            type: 'queryAgencyTypeList',
            payload: {},
          });
        }
        if (pathname === '/person/agencyList') {
          dispatch({
            type: 'queryAgencyList',
            payload: {},
          });
        }
      });
    },
  },
  effects: {
    * queryAgencyList({ payload }, { call, put }) {
      const data = yield call(queryAgencyList, { payload });
      console.log(data);
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
    * deleteAgency({ payload }, { call, put }) {
      const data = yield call(deleteAgency, { payload });
      if (data.success) {
        message.success('删除类目成功');
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
    * queryAgencyTypeList({ payload }, { call, put }) {
      const data = yield call(queryAgencyTypeList, { payload });
      console.log(data);
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
    * deleteAgencyType({ payload }, { call, put }) {
      const data = yield call(deleteAgencyType, { payload });
      if (data.success) {
        message.success('删除类目成功');
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
      return { ...state, agencyTypeValues: payload };
    },
    updateList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    saveAgency(state, { payload }) {
      return { ...state, agencyValues: payload };
    },
  },
};
