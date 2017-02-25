import { addSku, querySkuList } from '../services/sku';

export default {
  namespace: 'sku',
  state: {
    skuList: [],
  },
  reducers: {
    saveSku(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    saveSkuList(state, { payload: data }) {
      return { ...state, skuList: data };
    },
  },
  effects: {
    * addSku({ payload }, { call, put }) { // 新建SKU
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
    * querySkuList({ payload }, { call, put }) { // SKU管理列表
      const data = yield call(querySkuList, { payload });
      if (data.success) {
        yield put({
          type: 'saveSkuList',
          payload: data,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/products/skuList') {
          setTimeout(() => {
            dispatch({ type: 'querySkuList', payload: query });
          }, 0);
        }
      });
    },
  },
};
