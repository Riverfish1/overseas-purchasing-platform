import { addOrder, queryOrder, queryOrderList, queryOrderSku } from '../services/order';

export default {
  namespace: 'order',
  state: {
    orderList: [],
    orderSku: [],
  },
  reducers: {
    saveOrderList(state, { payload }) {
      return { ...state, orderList: payload };
    },
    saveOrderSku(state, { payload }) {
      return { ...state, orderSku: payload };
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
    * queryOrderList({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryOrderList, { payload });
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
