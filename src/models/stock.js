import { message } from 'antd';
import { addOrder, queryOrder, queryStockList, querySalesName, updateOrder } from '../services/stock';
import { querySkuList } from '../services/sku';

export default {
  namespace: 'stock',
  state: {
    stockList: [],
    orderSkuSnip: {},
    currentPage: 1,
    orderValues: {},
    salesName: [],
  },
  reducers: {
    updateStockList(state, { payload }) {
      return { ...state, stockList: payload };
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
      const data = yield call(queryStockList, { payload });
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
      const data = yield call(querySkuList, { payload: { skuCode: payload.keyword } });
      payload.callback(data.success ? data : 'ERROR');
    },
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
};
