import fetch from '../utils/request';

const queryWareList = ({ payload }) => fetch.get('/haierp1/warehouse/queryWarehouses', { data: payload }).catch(e => e);
const addWare = ({ payload }) => fetch.get('/haierp1/warehouse/add', { data: payload }).catch(e => e);
const updateWare = ({ payload }) => fetch.get('/haierp1/warehouse/update', { data: payload }).catch(e => e);
const queryWare = ({ payload }) => fetch.get('/haierp1/warehouse/query', { data: payload }).catch(e => e);

export default {
  namespace: 'system',
  state: {
    wareList: [],
    wareValues: {},
    wareCurrent: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/system/warehouse') {
          setTimeout(() => {
            dispatch({ type: 'queryWareList', payload: { pageIndex: 1 } });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryWareList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ system }) => system.wareCurrent);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveWareCurrent', payload });
      }
      const data = yield call(queryWareList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({ type: 'updateWareList', payload: data });
      }
    },
    * addWare({ payload }, { call, put }) {
      const data = yield call(addWare, { payload });
      if (data.success) {
        yield put({ type: 'queryWareList', payload: {} });
      }
    },
    * queryWare({ payload }, { call, put }) {
      const data = yield call(queryWare, { payload });
      if (data.success) {
        yield put({ type: 'saveWare', payload: data });
      }
    },
    * updateWare({ payload }, { call, put }) {
      const data = yield call(updateWare, { payload });
      if (data.success) {
        yield put({ type: 'queryWareList', payload: {} });
      }
    },
  },
  reducers: {
    saveWareCurrent(state, { payload }) {
      return { ...state, wareCurrent: payload.pageIndex };
    },
    saveWare(state, { payload }) {
      return { ...state, wareValues: payload };
    },
    updateWareList(state, { payload }) {
      return { ...state, wareList: payload.data };
    },
  },
};
