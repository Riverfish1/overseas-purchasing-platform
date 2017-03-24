import fetch from '../utils/request';

const queryWareList = ({ payload }) => fetch.get('/haierp1/warehouse/queryWarehouses', { data: payload }).catch(e => e);

export default {
  namespace: 'system',
  state: {
    wareList: [],
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
  },
  reducers: {
    saveWareCurrent(state, { payload }) {
      return { ...state, wareCurrent: payload.pageIndex };
    },
    updateWareList(state, { payload }) {
      return { ...state, wareList: payload.data };
    },
  },
};
