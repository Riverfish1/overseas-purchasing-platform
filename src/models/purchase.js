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

export default {
  namespace: 'purchase',
  state: {
    list: [],
    total: '',
    currentPage: '',
    purchaseValues: {},
    buyer: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/purchase/purchaseList') {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
          }, 0);
        }
        if (pathname === '/purchase/preStock') {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryPurchaseList({ payload }, { call, put }) {
      const data = yield call(queryPurchaseList, { payload });
      if (data.success) {
        data.data && data.data.forEach((el) => {
          const url = JSON.parse(decodeURIComponent(el.imageUrl).replace(/&quot;/g, '"')) || [];
          el.imageUrl = url.picList.length ? url.picList[0].url : '';
        });
        yield put({ type: 'updatePurchaseList', payload: data });
      }
    },
    * addPurchase({ payload }, { call, put }) {
      const data = yield call(addPurchase, { payload });
      if (data.success) {
        message.success('新增成功');
        yield put({
          type: 'queryPurchaseList',
          payload: {},
        });
      }
    },
    * updatePurchase({ payload }, { call, put }) {
      const data = yield call(updatePurchase, { payload });
      if (data.success) {
        message.success('修改成功');
        yield put({
          type: 'queryPurchaseList',
          payload: {},
        });
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
    * deletePurchase({ payload }, { call, put }) {
      const data = yield call(deletePurchase, { payload });
      if (data.success) {
        yield put({ type: 'queryPurchaseList', payload: {} });
      }
    },
    * exportPurchase({ payload }, { put }) {
      window.open(`http://${location.host}/haierp1/purchase/taskDailyExport?id=${payload.id}`);
      yield put({ type: 'queryPurchaseList', payload: {} });
    },
    * finishTaskDaily({ payload, success }, { call }) {
      const data = yield call(finishTaskDaily, { payload });
      if (data.success) {
        message.success('完成采购成功');
        if (success) success();
      }
    },
    * closeTaskDaily({ payload, success }, { call }) {
      const data = yield call(closeTaskDaily, { payload });
      if (data.success) {
        message.success('取消采购成功');
        if (success) success();
      }
    },
  },
  reducers: {
    updatePurchaseList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    savePurchase(state, { payload }) {
      return { ...state, purchaseValues: payload };
    },
    updateBuyers(state, { payload }) {
      return { ...state, buyer: payload.data };
    },
  },
};
