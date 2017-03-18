import { message } from 'antd';
import { queryPurchaseList, queryPurchase, addPurchase, updatePurchase, deletePurchase, queryBuyers } from '../services/purchase';

export default {
  namespace: 'purchase',
  state: {
    list: [],
    total: '',
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