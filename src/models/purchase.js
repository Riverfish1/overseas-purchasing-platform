import { message } from 'antd';
import { queryPurchaseList, queryPurchase, addPurchase, updatePurchase, queryBuyer } from '../services/purchase';

export default {
  namespace: 'purchase',
  state: {
    list: {},
    purchaseValues: {},
    buyer: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/purchase/purchaseList') {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: {} });
            dispatch({ type: 'queryBuyer', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryPurchaseList({ payload }, { call, put }) {
      const data = yield call(queryPurchaseList, { payload });
      if (data.success) {
        yield put({ type: 'updatePurchaseList', payload: data });
      }
    },
    * addPurchase({ payload }, { call, put }) {
      if (payload.orderTime) {
        payload.orderTime = payload.orderTime.format('YYYY-MM-DD');
      }
      const data = yield call(addPurchase, { payload });
      if (data.success) {
        message.success('增加采购成功');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * updatePurchase({ payload }, { call, put }) {
      const data = yield call(updatePurchase, { payload });
      if (data.success) {
        message.success('更新采购成功');
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
          type: 'updatePurchase',
          payload: data,
        });
      }
    },
    * queryBuyer({ payload }, { call, put }) {
      const data = yield call(queryBuyer, { payload });
      if (data.success) {
        yield put({ type: 'updateBuyer', payload: data });
      }
    },
  },
  reducers: {
    updatePurchaseList(state, { payload }) {
      return { ...state, list: payload };
    },
    updatePurchase(state, { payload }) {
      return { ...state, purchaseValues: payload };
    },
    updateBuyer(state, { payload }) {
      return { ...state, buyer: payload };
    },
  },
};
