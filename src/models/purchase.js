import { message } from 'antd';
import fetch from '../utils/request';

const addPurchase = ({ payload }) => fetch.post('/haierp1/purchase/add', { data: payload }).catch(e => e);
const updatePurchase = ({ payload }) => fetch.post('/haierp1/purchase/update', { data: payload }).catch(e => e);
const queryPurchaseList = ({ payload }) => fetch.post('/haierp1/purchase/queryTaskDailyList', { data: payload }).catch(e => e);
const queryPurchase = ({ payload }) => fetch.post('/haierp1/purchase/query', { data: payload }).catch(e => e);
const queryBuyers = ({ payload }) => fetch.post('/haierp1/purchase/queryBuyers', { data: payload }).catch(e => e);
const deletePurchase = ({ payload }) => fetch.post('/haierp1/purchase/delete', { data: payload }).catch(e => e);
// 取消采购
const closeTaskDaily = ({ payload }) => fetch.post('/haierp1/purchase/closeTaskDaily', { data: payload }).catch(e => e);
// 完成采购
const finishTaskDaily = ({ payload }) => fetch.post('/haierp1/purchase/finishTaskDaily', { data: payload }).catch(e => e);
// 根据当前订单生成采购任务
const createByOrder = () => fetch.get('/haierp1/purchase/autoAddByOrder').catch(e => e);

export default {
  namespace: 'purchase',
  state: {
    list: [],
    total: '',
    currentPage: 1,
    currentPageSize: 20,
    purchaseValues: {},
    buyer: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/purchase/purchaseList' && !window.existCacheState('/purchase/purchaseList')) {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
          }, 0);
        }
        if (pathname === '/purchase/preStock' && !window.existCacheState('/purchase/preStock')) {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryPurchaseList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ purchase }) => purchase.currentPage);
      let pageSize = yield select(({ purchase }) => purchase.currentPageSize);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      if (payload && payload.pageSize) {
        pageSize = payload.pageSize;
        yield put({ type: 'saveCurrentPageSize', payload });
      }
      const data = yield call(queryPurchaseList, { payload: { ...payload, pageIndex, pageSize } });
      if (data.success) {
        yield put({ type: 'updatePurchaseList', payload: data });
      }
    },
    * addPurchase({ payload, cb }, { call }) {
      const data = yield call(addPurchase, { payload });
      if (data.success) {
        message.success('新增采购成功');
        cb();
      }
    },
    * updatePurchase({ payload, cb }, { call }) {
      const data = yield call(updatePurchase, { payload });
      if (data.success) {
        message.success('修改采购成功');
        cb();
      }
    },
    * queryPurchase({ payload }, { call, put }) {
      const newPayload = { ...payload };
      delete newPayload.type;
      const data = yield call(queryPurchase, { payload: newPayload });
      if (data.success) {
        yield put({
          type: 'savePurchase',
          payload: data,
        });
      }
    },
    * queryBuyers({ payload }, { call, put }) {
      const data = yield call(queryBuyers, { payload });
      if (data.success) {
        yield put({ type: 'updateBuyers', payload: data });
      }
    },
    * deletePurchase({ payload, cb }, { call }) {
      const data = yield call(deletePurchase, { payload });
      if (data.success) cb();
    },
    * createByOrder({ payload, cb }, { call }) {
      const data = yield call(createByOrder);
      if (data.success) {
        message.success('生产采购任务成功');
        cb();
      }
    },
    * exportPurchase({ payload }, { put }) {
      window.open(`http://${location.host}/haierp1/purchase/taskDailyExport?id=${payload.id}`);
      yield put({ type: 'queryPurchaseList', payload: {} });
    },
    * finishTaskDaily({ payload, cb }, { call }) {
      const data = yield call(finishTaskDaily, { payload });
      if (data.success) {
        message.success('完成采购成功');
        if (cb) cb();
      }
    },
    * closeTaskDaily({ payload, cb }, { call }) {
      const data = yield call(closeTaskDaily, { payload });
      if (data.success) {
        message.success('取消采购成功');
        if (cb) cb();
      }
    },
  },
  reducers: {
    updatePurchaseList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveCurrentPageSize(state, { payload }) {
      return { ...state, currentPageSize: payload.pageSize };
    },
    savePurchase(state, { payload }) {
      return { ...state, purchaseValues: payload };
    },
    updateBuyers(state, { payload }) {
      return { ...state, buyer: payload.data };
    },
  },
};
