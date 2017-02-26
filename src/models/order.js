import { addOrder, queryOrderList } from '../services/order';

export default {
  namespace: 'order',
  state: {
    cateList: [],
  },
  reducers: {
    saveCate(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    saveCateList(state, { payload: data }) {
      return { ...state, skuList: data };
    },
  },
  effects: {
    * addOrder({ payload }, { call, put }) { // 新建SKU
      const data = yield call(addSku, { payload });
      if (data.success) {
        yield put({
          type: 'saveSku',
          payload: {
            dataSource: data.dataSource,
          },
        });
      }
    },
    * queryOrderList({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryOrderList, { payload });
      if (data.success) {
        yield put({
          type: 'saveCateList',
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
