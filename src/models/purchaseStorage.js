import { message } from 'antd';
import fetch from '../utils/request';

// 采购入库相关接口
const queryPurchaseStorageList = ({ payload }) => fetch.post('/haierp1/purchaseStorage/queryPurStorages', { data: payload }).catch(e => e);
const queryBuyerTaskList = ({ payload }) => fetch.post('/haierp1/purchase/queryBuyerTaskList', { data: payload }).catch(e => e);
const addStorage = ({ payload }) => fetch.post('/haierp1/purchaseStorage/add', { data: payload }).catch(e => e);
const saveStorage = ({ payload }) => fetch.post('/haierp1/purchaseStorage/update', { data: payload }).catch(e => e);
const confirmStorage = ({ payload }) => fetch.post('/haierp1/purchaseStorage/confirm', { data: payload }).catch(e => e);
const deleteStorage = ({ payload }) => fetch.post('/haierp1/purchaseStorage/delete', { data: payload }).catch(e => e);
const queryPurchaseStorage = ({ payload }) => fetch.post('/haierp1/purchaseStorage/query', { data: payload }).catch(e => e);
const multiConfirmStorage = ({ payload }) => fetch.post('/haierp1/purchaseStorage/multiConfirm', { data: payload }).catch(e => e);
const queryBuyers = ({ payload }) => fetch.post('/haierp1/purchase/queryBuyers', { data: payload }).catch(e => e);

export default {
  namespace: 'purchaseStorage',
  state: {
    list: [],
    total: '',
    currentPage: '',
    purchaseValues: {},
    buyer: [],
    // 修改的状态
    buyerTaskList: [],
    showModal: false,
    editInfo: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/purchase/purchaseStorage' && !window.existCacheState('/purchase/purchaseStorage')) {
          setTimeout(() => {
            dispatch({ type: 'queryPurchaseStorageList', payload: {} });
            dispatch({ type: 'queryBuyers', payload: {} });
            dispatch({ type: 'inventory/queryWareList', payload: {} });
          }, 0);
        }
      });
    },
  },
  effects: {
    * queryPurchaseStorageList({ payload }, { call, put }) {
      const data = yield call(queryPurchaseStorageList, { payload });
      if (typeof data.success !== 'undefined') {
        yield put({ type: 'updatePurchaseStorageList', payload: data });
      }
    },
    * queryBuyers({ payload }, { call, put }) {
      const data = yield call(queryBuyers, { payload });
      if (data.success) {
        yield put({ type: 'updateBuyers', payload: data });
      }
    },
    * queryBuyerTaskList({ payload }, { call, put }) {
      const data = yield call(queryBuyerTaskList, { payload });
      if (data.success) {
        yield put({ type: 'updateBuyerTaskList', payload: data });
      }
    },
    * addStorage({ payload }, { call, put }) {
      const data = yield call(addStorage, { payload: payload.fieldsValue });
      if (data.success) {
        message.success('添加入库单成功');
        if (payload.success) payload.success();
        yield put({ type: 'queryPurchaseStorageList', payload: {} });
      }
    },
    * saveStorage({ payload }, { call, put }) {
      const data = yield call(saveStorage, { payload: payload.fieldsValue });
      if (data.success) {
        message.success('修改入库单成功');
        if (payload.success) payload.success();
        yield put({ type: 'queryPurchaseStorageList', payload: {} });
      }
    },
    * confirmStorage({ payload }, { call, put }) {
      const data = yield call(confirmStorage, { payload: payload.fieldsValue });
      if (data.success) {
        message.success('确认入库成功');
        if (payload.success) payload.success();
        yield put({ type: 'queryPurchaseStorageList', payload: {} });
      }
    },
    * queryStorage({ payload }, { call, put }) {
      const data = yield call(queryPurchaseStorage, { payload });
      if (data.success) {
        yield put({ type: 'updateStorage', payload: data });
      }
    },
    * deleteStorage({ payload }, { call, put }) {
      const data = yield call(deleteStorage, { payload });
      if (data.success) {
        message.success('删除入库单成功');
        yield put({ type: 'queryPurchaseStorageList', payload: {} });
      }
    },
    * multiConfirmStorage({ payload }, { call, put }) {
      const data = yield call(multiConfirmStorage, { payload });
      if (data.success) {
        message.success('批量入库成功');
        yield put({ type: 'queryPurchaseStorageList', payload: {} });
      }
    },
    exportDetail({ payload }) {
      window.open(`http://${location.host}/haierp1/purchaseStorage/purchaseExport?id=${payload.id}`);
    },
  },
  reducers: {
    // 修改的状态
    toggleShowModal(state) { return { ...state, showModal: !state.showModal }; },
    clearEditInfo(state) { return { ...state, editInfo: {} }; },
    updateEditInfo(state, { payload }) { return { ...state, editInfo: { ...state.editInfo, ...payload } }; },
    updatePurchaseStorageList(state, { payload }) {
      return { ...state, list: payload.data, total: payload.totalCount };
    },
    updateBuyers(state, { payload }) {
      return { ...state, buyer: payload.data };
    },
    updateBuyerTaskList(state, { payload }) {
      return { ...state, buyerTaskList: payload.data };
    },
    updateStorage(state, { payload }) {
      return { ...state, editInfo: payload.data };
    },
  },
};
