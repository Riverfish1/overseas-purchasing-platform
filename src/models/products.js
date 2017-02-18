import { queryProductTable } from '../services/products';

export default {
  namespace: 'products',
  state: {
    dataSource: [],
  },
  reducers: {
    saveTable(state, { payload: { data: dataSource } }) {
      return { ...state, dataSource };
    },
  },
  effects: {
    * queryProductTable({ payload: { page = 1 } }, { call, put }) {
      const { data } = yield call(queryProductTable, { page });
      yield put({
        type: 'save',
        payload: {
          dataSource: data.dataSource,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/products') {
          dispatch({ type: 'queryProductTable', payload: query });
        }
      });
    },
  },
};
