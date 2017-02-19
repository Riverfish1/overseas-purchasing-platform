import { queryProductTable, queryItemList } from '../services/products';

export default {
  namespace: 'products',
  state: {
    dataSource: [],
  },
  reducers: {
    saveTable(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    savaItemList(state, { payload: data }) {
      return { ...state, data };
    },
  },
  effects: {
    * queryProductTable({ payload: { page = 1 } }, { call, put }) {
      const { data } = yield call(queryProductTable, { page });
      yield put({
        type: 'saveTable',
        payload: {
          dataSource: data.dataSource,
        },
      });
    },
    * queryItemList({ payload }, { call, put }) {
      const { data } = yield call(queryItemList, { payload });
      yield put({
        type: 'savaItemList',
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/products/productsList') {
          dispatch({ type: 'queryProductTable', payload: query });
        }
      });
    },
  },
};
