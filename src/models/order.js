import { addOrder, queryOrder, queryOrderList, queryOrderSku, querySalesName } from '../services/order';
import { message } from 'antd';

export default {
  namespace: 'order',
  state: {
    orderList: [],
    orderSku: [],
    currentPage: 1,
    orderValues: {},
    salesName: [],
  },
  reducers: {
    saveOrderList(state, { payload }) {
      return { ...state, orderList: payload };
    },
    saveOrderSku(state, { payload }) {
      return { ...state, orderSku: payload };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveOrder(state, { payload }) {
      return { ...state, orderValues: payload };
    },
    saveSalesName(state, { payload }) {
      return { ...state, salesName: payload };
    },
  },
  effects: {
    * addOrder({ payload }, { call, put }) { // 新建SKU
      const data = yield call(addOrder, { payload });
      if (data.success) {
        message.success('增加订单成功');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * queryOrder({ payload }, { call, put }) {
      const data = yield call(queryOrder, { payload });
      if (data.success) {
        message.success('查询订单成功');
        yield put({
          type: 'saveOrder',
          payload: data,
        });
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
      console.log('queryOrderList success', data);
      if (data.success) {
        message.success('获取订单列表成功');
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
    * queryOrderSku({ payload }, { call, put }) {
      const data = yield call(queryOrderSku, { payload });
      if (data.success) {
        message.success('获取订单SKU成功');
        yield put({
          type: 'saveOrderSku',
          payload: data,
        });
      }
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
