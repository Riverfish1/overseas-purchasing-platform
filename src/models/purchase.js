import { message } from 'antd';
import { queryPurchaseList, queryPurchase, addPurchase, updatePurchase } from '../services/purchase';

export default {
  namespace: 'purchase',
  state: {
    list: {},
    purchaseValues: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/purchase/purchaseList') {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseList', payload: query });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryPurchaseList({ payload }, { call, put }) {
      const data = yield call(queryPurchaseList, payload);
      if (data.success) {
        yield put({
          type: 'updatePurchaseList',
          payload: data,
        });
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
  },
  reduces: {
    updatePurchaseList(state, payload) {
      return { ...state, list: payload };
    },
    updatePurchase(state, payload) {
      return { ...state, purchaseValues: payload };
    },
  },
};
