import { addOrder, queryOrder, queryOrderList, queryOrderSku } from '../services/order';

export default {
  namespace: 'order',
  state: {
    orderList: [],
    orderSku: [],
    currentPage: 1, // 默认页码
  },
  reducers: {
    saveOrderList(state, { payload }) {
      return { ...state, orderList: payload };
    },
    saveOrderSku(state, { payload }) {
      return { ...state, orderSku: payload };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
  },
  effects: {
    * addOrder({ payload }, { call, put }) { // 新建SKU
      const data = yield call(addOrder, { payload });
      if (data.success) {
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * queryOrder({ payload }, { call, put }) {
      const data = yield call(queryOrder, { payload });
      if (data.success) {
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * queryOrderList({ payload }, { call, put, select }) { // 类目管理列表
      let pageIndex = yield select(({ order }) => order.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(queryOrderList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'saveOrderList',
          payload: data,
        });
      }
    },
    * queryOrderSku({ payload }, { call, put }) {
      const data = yield call(queryOrderSku, { payload });
      if (data.success) {
        yield put({
          type: 'saveOrderSku',
          payload: data,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/sale/orderList') {
          setTimeout(() => {
            dispatch({ type: 'queryOrderList', payload: query });
          }, 0);
        }
      });
    },
  },
};
