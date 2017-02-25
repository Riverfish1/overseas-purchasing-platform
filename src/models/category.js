import { addCate, queryCateList } from '../services/category';

export default {
  namespace: 'cate',
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
    * addCate({ payload }, { call, put }) { // 新建SKU
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
    * queryCateList({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryCateList, { payload });
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
        if (pathname === '/products/cateList') {
          setTimeout(() => {
            dispatch({ type: 'querySkuList', payload: query });
          }, 0);
        }
      });
    },
  },
};
