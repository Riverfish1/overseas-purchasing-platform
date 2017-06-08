import { message } from 'antd';
import fetch from '../utils/request';

const queryInventoryList = ({ payload }) => fetch.post('/haierp1/inventory/area/queryList', { data: payload }).catch(e => e);
const queryInventoryRecordList = ({ payload }) => fetch.post('/haierp1/inventory/record/queryList', { data: payload }).catch(e => e);
const transTo = ({ payload }) => fetch.post('/haierp1/inventory/area/transTo', { data: payload }).catch(e => e);
const checkIn = ({ payload }) => fetch.post('/haierp1/inventory/inventoryCheckIn', { data: payload }).catch(e => e);
const checkOut = ({ payload }) => fetch.post('/haierp1/inventory/inventoryCheckOut', { data: payload }).catch(e => e);
// 仓库管理
const queryWareList = ({ payload }) => fetch.get('/haierp1/warehouse/queryWarehouses', { data: payload }).catch(e => e);
const addWare = ({ payload }) => fetch.get('/haierp1/warehouse/add', { data: payload }).catch(e => e);
const updateWare = ({ payload }) => fetch.get('/haierp1/warehouse/update', { data: payload }).catch(e => e);
const queryWare = ({ payload }) => fetch.get('/haierp1/warehouse/query', { data: payload }).catch(e => e);
// 在途入仓
export default {
  namespace: 'inventory',
  state: {
    list: [],
    total: 1,
    currentPage: 1,
    wareList: [],
    wareValues: {},
    wareCurrent: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/inventory/inventoryList') {
          setTimeout(() => {
            dispatch({
              type: 'queryList',
              payload: { pageIndex: 1 },
            });
          }, 0);
        }
        if (pathname === '/inventory/warehouse') {
          setTimeout(() => {
            dispatch({ type: 'queryWareList', payload: { pageIndex: 1 } });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ inventory }) => inventory.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(queryInventoryList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'updateList',
          payload: data,
        });
      }
    },
    * queryRecordList({ payload, success }, { call }) {
      const data = yield call(queryInventoryRecordList, { payload });
      if (data.success) {
        if (success) success(data);
      }
    },
    * queryWareList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ inventory }) => inventory.wareCurrent);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveWareCurrent', payload });
      }
      const data = yield call(queryWareList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateWareList', payload: data });
      }
    },
    * addWare({ payload }, { call, put }) {
      const data = yield call(addWare, { payload });
      if (data.success) {
        yield put({ type: 'queryWareList', payload: {} });
      }
    },
    * queryWare({ payload }, { call, put }) {
      const data = yield call(queryWare, { payload });
      if (data.success) {
        yield put({ type: 'saveWare', payload: data });
      }
    },
    * updateWare({ payload }, { call, put }) {
      const data = yield call(updateWare, { payload });
      if (data.success) {
        yield put({ type: 'queryWareList', payload: {} });
      }
    },
    * transTo({ payload }, { call, put }) {
      const data = yield call(transTo, { payload });
      if (data.success) {
        message.success('操作成功');
        yield put({ type: 'queryList', payload: {} });
      }
    },
    * checkIn({ payload }, { call, put }) {
      const data = yield call(checkIn, { payload });
      if (data.success) {
        message.success('操作成功');
        yield put({ type: 'queryList', payload: {} });
      }
    },
    * checkOut({ payload }, { call, put }) {
      const data = yield call(checkOut, { payload });
      if (data.success) {
        message.success('操作成功');
        yield put({ type: 'queryList', payload: {} });
      }
    },
  },
  reducers: {
    updateList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveWareCurrent(state, { payload }) {
      return { ...state, wareCurrent: payload.pageIndex };
    },
    saveWare(state, { payload }) {
      return { ...state, wareValues: payload };
    },
    updateWareList(state, { payload }) {
      return { ...state, wareList: payload.data };
    },
  },
};
