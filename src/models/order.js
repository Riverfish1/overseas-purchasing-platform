import { message } from 'antd';
import { addOrder, queryOrder, queryOrderList, querySalesName, updateOrder, deleteOrder } from '../services/order';
import { querySkuList } from '../services/sku';

export default {
  namespace: 'order',
  state: {
    orderList: [],
    orderTotal: 0,
    orderSkuSnip: {},
    currentPage: 1,
    orderValues: {},
    salesName: [],
  },
  reducers: {
    saveOrderList(state, { payload }) {
      return { ...state, orderList: payload.data, orderTotal: payload.totalCount };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveOrder(state, { payload }) {
      return { ...state, orderValues: payload };
    },
    saveOrderSkuSnip(state, { payload }) {
      return { ...state, orderSkuSnip: payload };
    },
    saveSalesName(state, { payload }) {
      return { ...state, salesName: payload };
    },
  },
  effects: {
    * addOrder({ payload }, { call, put }) { // 新建SKU
      if (payload.orderTime) {
        payload.orderTime = payload.orderTime.format('YYYY-MM-DD');
      }
      const data = yield call(addOrder, { payload });
      if (data.success) {
        message.success('增加订单成功');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * updateOrder({ payload }, { call, put }) {
      if (payload.orderTime) { payload.orderTime = payload.orderTime.format('YYYY-MM-DD'); }
      const data = yield call(updateOrder, { payload });
      if (data.success) {
        message.success('更新订单成功');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * deleteOrder({ payload }, { call, put, select }) {
      const data = yield call(deleteOrder, { payload });
      if (data.success) {
        message.success('删除订单成功');
        const order = yield select(model => model.order);
        if (order.orderList.length < 2 && order.currentPage > 1) {
          yield put({
            type: 'queryOrderList',
            payload: { pageIndex: order.currentPage - 1 },
          });
          return;
        }
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * queryOrder({ payload }, { call, put }) {
      const newPayload = { ...payload };
      delete newPayload.type;
      const data = yield call(queryOrder, { payload: newPayload });
      if (data.success) {
        if (payload.type === 'snip') {
          yield put({
            type: 'saveOrderSkuSnip',
            payload: data,
          });
        } else {
          yield put({
            type: 'saveOrder',
            payload: data,
          });
        }
      }
    },
    * queryOrderList({ payload }, { call, put, select }) { // 订单管理列表
      let pageIndex = yield select(({ order }) => order.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      if (payload.startGmt) payload.startGmt = payload.startGmt.format('YYYY-MM-DD');
      if (payload.endGmt) payload.endGmt = payload.endGmt.format('YYYY-MM-DD');
      const data = yield call(queryOrderList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'saveOrderList',
          payload: data,
        });
      }
    },
    * querySalesName({ payload }, { call, put }) {
      const data = yield call(querySalesName, { payload });
      if (data.success) {
        yield put({
          type: 'saveSalesName',
          payload: data,
        });
      }
    },
    * searchSku({ payload }, { call }) {
      const param = {};
      if (payload.keyword.skuCode) { param.skuCode = payload.keyword.skuCode; }
      if (payload.keyword.name) { param.name = payload.keyword.name; }
      const data = yield call(querySkuList, { payload: param });
      payload.callback(data.success ? data : 'ERROR');
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/sale/orderList') {
          setTimeout(() => {
            dispatch({ type: 'queryOrderList', payload: query });
          }, 0);
        }
      });
    },
  },
};
