import { 
  addProducts,
  addSku,
  addCate,
  queryItemList,
  querySkuList,
  queryCateList,
} from '../services/products';

export default {
  namespace: 'products',
  state: {
    productsList: [],
    skuList: [],
    cateList: [],
  },
  reducers: {
    saveProducts(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    saveSku(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    saveCate(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    savaItemList(state, { payload: data }) {
      return { ...state, productsList: data };
    },
    savaSkuList(state, { payload: data }) {
      return { ...state, skuList: data };
    },
    savaCateList(state, { payload: data }) {
      return { ...state, cateList: data };
    },
  },
  effects: {
    * addProducts({ payload }, { call, put }) {
      const { data } = yield call(addProducts, { payload });
      yield put({
        type: 'saveProducts',
        payload: {
          dataSource: data.dataSource,
        },
      });
    },
    * addSku({ payload }, { call, put }) {
      const { data } = yield call(addSku, { payload });
      yield put({
        type: 'saveSku',
        payload: {
          dataSource: data.dataSource,
        },
      });
    },
    * addCate({ payload }, { call, put }) {
      const { data } = yield call(addCate, { payload });
      yield put({
        type: 'saveCate',
        payload: {
          dataSource: data.dataSource,
        },
      });
    },
    * queryItemList({ payload }, { call, put }) {
      const { data } = yield call(queryItemList, { payload });
      console.log('queryItemList success', data);
      if (data.success) {
        yield put({
          type: 'savaItemList',
          payload: data,
        });
      }
    },
    * querySkuList({ payload }, { call, put }) {
      const { data } = yield call(querySkuList, { payload });
      yield put({
        type: 'savaSkuList',
        payload: data,
      });
    },
    * queryCateList({ payload }, { call, put }) {
      const { data } = yield call(queryCateList, { payload });
      yield put({
        type: 'savaCateList',
        payload: data,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/products/productsList') {
          dispatch({ type: 'queryItemList', payload: query });
        }
        if (pathname === '/products/skuList') {
          dispatch({ type: 'querySkuList', payload: query });
        }
        if (pathname === '/products/cateList') {
          dispatch({ type: 'queryCateList', payload: query });
        }
      });
    },
  },
};
