import { message } from 'antd';
import fetch from '../utils/request';

const addOrder = ({ payload }) => fetch.post('/haierp1/order/add', { data: payload }).catch(e => e);
const updateOrder = ({ payload }) => fetch.post('/haierp1/order/update', { data: payload }).catch(e => e);
const deleteOrder = ({ payload }) => fetch.post('/haierp1/order/delete', { data: payload }).catch(e => e);
const queryOrderList = ({ payload }) => fetch.post('/haierp1/order/queryOrderList', { data: payload }).catch(e => e);
const queryOrder = ({ payload }) => fetch.post('/haierp1/order/query', { data: payload }).catch(e => e);
const querySalesName = ({ payload }) => fetch.post('/haierp1/order/querySalesName', { data: payload }).catch(e => e);

export default {
  namespace: 'stock',
  state: {
    stockList: [],
    orderSkuSnip: {},
    currentPage: 1,
    orderValues: {},
    salesName: [],
    total: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/purchase/purchaseStockIn') {
          setTimeout(() => {
            dispatch({ type: 'queryStockList', payload: {} });
            dispatch({ type: 'purchase/queryBuyer', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    * addOrder({ payload }, { call, put }) { // 新建SKU
      if (payload.orderTime) {
        payload.orderTime = payload.orderTime.format('YYYY-MM-DD');
      }
      const data = yield call(addOrder, { payload });
      if (data.success) {
        message.success('增加订单成功');
        yield put({
          type: 'queryStockList',
          payload: {},
        });
      }
    },
    * updateOrder({ payload }, { call, put }) {
      if (payload.orderTime) { payload.orderTime = payload.orderTime.format('YYYY-MM-DD'); }
      const data = yield call(updateOrder, { payload });
      if (data.success) {
        message.success('更新订单成功');
        yield put({
          type: 'queryStockList',
          payload: {},
        });
      }
    },
    * queryOrder({ payload }, { call, put }) {
      const newPayload = { ...payload };
      delete newPayload.type;
      const data = yield call(queryOrder, { payload: newPayload });
      if (data.success) {
        if (payload.type === 'snip') {
          yield put({
            type: 'saveOrderSkuSnip',
            payload: data,
          });
        } else {
          yield put({
            type: 'saveOrder',
            payload: data,
          });
        }
      }
    },
    * queryStockList({ payload }, { call, put }) {
      const data = yield call(queryOrderList, { payload });
      if (data.success) {
        yield put({
          type: 'updateStockList',
          payload: data,
        });
      }
    },
    * querySalesName({ payload }, { call, put }) {
      const data = yield call(querySalesName, { payload });
      if (data.success) {
        yield put({
          type: 'saveSalesName',
          payload: data,
        });
      }
    },
    * searchSku({ payload }, { call }) {
      const data = yield call(deleteOrder, { payload: { skuCode: payload.keyword } });
      payload.callback(data.success ? data : 'ERROR');
    },
  },
  reducers: {
    updateStockList(state, { payload }) {
      return { ...state, stockList: payload.data, total: payload.total };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveOrder(state, { payload }) {
      return { ...state, orderValues: payload };
    },
    saveOrderSkuSnip(state, { payload }) {
      return { ...state, orderSkuSnip: payload };
    },
    saveSalesName(state, { payload }) {
      return { ...state, salesName: payload };
    },
  },
};
