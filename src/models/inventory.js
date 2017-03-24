import fetch from '../utils/request';

const queryInventoryList = ({ payload }) => fetch.post('/haierp1/inventory/area/queryList', { data: payload }).catch(e => e);

export default {
  namespace: 'inventory',
  state: {
    list: [],
    total: 1,
    currentPage: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/inventory/inventoryList') {
          setTimeout(() => {
            dispatch({
              type: 'queryList',
              payload: { pageIndex: 1 },
            });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ inventory }) => inventory.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(queryInventoryList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'updateList',
          payload: data,
        });
      }
    },
  },
  reducers: {
    updateList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
  },
};
