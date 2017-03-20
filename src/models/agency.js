import { message } from 'antd';
import { queryAgencyTypeList, queryAgencyType, deleteAgencyType, updateAgencyType, addAgencyType } from '../services/agency';

export default {
  namespace: 'agency',
  state: {
    typeList: [],
    agencyTypeValues: {},
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
      });
    },
  },
  effects: {
    * queryAgencyTypeList({ payload }, { call, put }) {
      const data = yield call(queryAgencyTypeList, payload);
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
      return { ...state, typeList: payload };
    },
    saveAgencyType(state, { payload }) {
      return { ...state, agencyTypeValues: payload };
    },
  },
};
