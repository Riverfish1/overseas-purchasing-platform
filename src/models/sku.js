import { addSku, querySkuList } from '../services/sku';

export default {
  namespace: 'sku',
  state: {
    skuList: {},
    currentPage: 1,
  },
  reducers: {
    saveSku(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    saveItemSkuList(state, { payload }) {
      return { ...state, skuList: payload };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
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
    * querySkuList({ payload = {} }, { call, put, select }) { // SKU管理列表
      let pageIndex = yield select(({ sku }) => sku.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(querySkuList, { payload: { ...payload, pageIndex } });
      console.log('querySkuList success', data);
      if (data.success) {
        yield put({
          type: 'saveItemSkuList',
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
