import { message } from 'antd';
import qs from 'querystring';
import fetch from '../utils/request';

const queryInventoryList = ({ payload }) => fetch.post('/haierp1/inventory/area/queryList', { data: payload }).catch(e => e);
const queryInventoryRecordList = ({ payload }) => fetch.post('/haierp1/inventory/record/queryList', { data: payload }).catch(e => e);
// 在途入仓
const transTo = ({ payload }) => fetch.post('/haierp1/inventory/area/transTo', { data: payload }).catch(e => e);
// 库存盘进
const checkIn = ({ payload }) => fetch.post('/haierp1/inventory/inventoryCheckIn', { data: payload }).catch(e => e);
// 库存盘出
const checkOut = ({ payload }) => fetch.post('/haierp1/inventory/inventoryCheckOut', { data: payload }).catch(e => e);
// 仓库管理
const queryWareList = ({ payload }) => fetch.get('/haierp1/warehouse/queryWarehouses', { data: payload }).catch(e => e);
const addWare = ({ payload }) => fetch.get('/haierp1/warehouse/add', { data: payload }).catch(e => e);
const updateWare = ({ payload }) => fetch.get('/haierp1/warehouse/update', { data: payload }).catch(e => e);
const queryWare = ({ payload }) => fetch.get('/haierp1/warehouse/query', { data: payload }).catch(e => e);

// 出入库记录
const queryInoutList = ({ payload }) => fetch.post('/haierp1/inventory/queryInventoryInout', { data: payload }).catch(e => e);
// 换货架号
const changePositionNo = ({ payload }) => fetch.post('/haierp1/inventory/changePositionNo', { data: payload }).catch(e => e);
// 出库管理
const queryOutList = ({ payload }) => fetch.post('/haierp1/inventory/inventoryOutQueryList', { data: payload }).catch(e => e);
const addOut = ({ payload }) => fetch.post('/haierp1/inventory/inventoryOutAdd', { data: payload }).catch(e => e);
const updateOut = ({ payload }) => fetch.post('/haierp1/inventory/inventoryOutUpdate', { data: payload }).catch(e => e);
const queryOut = ({ payload }) => fetch.post('/haierp1/inventory/inventoryOutQuery', { data: payload }).catch(e => e);
const confirmOut = ({ payload }) => fetch.post('/haierp1/inventory/inventoryOutConfirm', { data: payload }).catch(e => e);

export default {
  namespace: 'inventory',
  state: {
    list: [],
    total: 1,
    currentPage: 1,
    wareList: [],
    wareValues: {},
    wareCurrent: 1,
    inoutList: [],
    inoutCurrent: 1,
    inoutTotal: 1,
    outList: [],
    outCurrent: 1,
    outTotal: 1,
    outValues: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/inventory/inventoryList' && !window.existCacheState('/inventory/inventoryList')) {
          setTimeout(() => {
            dispatch({ type: 'queryList', payload: { pageIndex: 1 } });
            dispatch({ type: 'queryWareList', payload: { pageIndex: 1 } });
          }, 0);
        }
        if (pathname === '/inventory/warehouse' && !window.existCacheState('/inventory/warehouse')) {
          setTimeout(() => {
            dispatch({ type: 'queryWareList', payload: { pageIndex: 1 } });
          }, 0);
        }
        if (pathname === '/inventory/inout' && !window.existCacheState('/inventory/inout')) {
          setTimeout(() => {
            dispatch({ type: 'queryInoutList', payload: { pageIndex: 1 } });
            dispatch({ type: 'queryWareList', payload: { pageIndex: 1 } });
          }, 0);
        }
        if (pathname === '/inventory/out' && !window.existCacheState('/inventory/out')) {
          setTimeout(() => {
            dispatch({ type: 'queryOutList', payload: { pageIndex: 1 } });
            dispatch({ type: 'queryWareList', payload: { pageIndex: 1 } });
          }, 0);
        }
      });
    },
  },
  effects: {
    // 库存管理
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
    * changePositionNo({ payload, cb }, { call }) {
      const data = yield call(changePositionNo, { payload });
      if (data.success) {
        message.success('更换货架号成功');
        cb();
      }
    },
    exportInv({ payload }) {
      const param = qs.stringify(payload);
      window.open(`http://${location.host}/haierp1/inventory/inventoryAreaExport?${param}`);
    },
    * transTo({ payload, cb }, { call }) {
      const data = yield call(transTo, { payload });
      if (data.success) {
        message.success('操作成功');
        cb();
      }
    },
    * checkIn({ payload, cb }, { call }) {
      const data = yield call(checkIn, { payload });
      if (data.success) {
        message.success('操作成功');
        cb();
      }
    },
    * checkOut({ payload, cb }, { call }) {
      const data = yield call(checkOut, { payload });
      if (data.success) {
        message.success('操作成功');
        cb();
      }
    },
    // 仓库管理
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
    // 出入库记录
    * queryInoutList({ payload = {} }, { call, put, select }) {
      let pageIndex = yield select(({ inventory }) => inventory.inoutCurrent);
      if (payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({
          type: 'saveInoutCurrent',
          payload,
        });
      }
      const data = yield call(queryInoutList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateInoutList', payload: data });
      }
    },
    * queryRecordList({ payload, success }, { call }) {
      const data = yield call(queryInventoryRecordList, { payload });
      if (data.success) {
        if (success) success(data);
      }
    },
    // 出库单管理
    * queryOutList({ payload }, { call, put }) {
      const data = yield call(queryOutList, { payload });
      if (data.success) {
        yield put({
          type: 'saveOutList',
          payload: data,
        });
      }
    },
    * addOut({ payload, cb }, { call }) {
      const data = yield call(addOut, { payload });
      if (data.success) {
        message.success('新增出库单成功');
        cb();
      }
    },
    * updateOut({ payload, cb }, { call }) {
      const data = yield call(updateOut, { payload });
      if (data.success) {
        message.success('修改出库单成功');
        cb();
      }
    },
    * queryOut({ payload }, { call, put }) {
      const data = yield call(queryOut, { payload });
      if (data.success) {
        yield put({
          type: 'saveOut',
          payload: data,
        });
      }
    },
    * confirmOut({ payload, cb }, { call }) {
      const data = yield call(confirmOut, { payload });
      if (data.success) {
        message.success('确认出库成功');
        cb();
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
    updateInoutList(state, { payload }) {
      return { ...state, inoutList: payload.data, inoutTotal: payload.totalCount };
    },
    saveInoutCurrent(state, { payload }) {
      return { ...state, inoutCurrent: payload.pageIndex };
    },
    saveOutList(state, { payload }) {
      return { ...state, outList: payload.data };
    },
    saveOut(state, { payload }) {
      return { ...state, outValues: payload.data };
    },
  },
};
