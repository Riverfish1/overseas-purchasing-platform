import { message } from 'antd';
import fetch from '../utils/request';

const addOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/add', { data: payload }).catch(e => e);
const updateOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/update', { data: payload }).catch(e => e);
const querySkuList = ({ payload }) => fetch.post('/haierp1/itemSku/queryItemSkuList', { data: payload }).catch(e => e);
const deleteOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/delete', { data: payload }).catch(e => e);
const queryOrderList = ({ payload }) => fetch.post('/haierp1/outerOrder/queryOuterOrderList', { data: payload }).catch(e => e);
const queryOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/query', { data: payload }).catch(e => e);
const querySalesName = ({ payload }) => fetch.post('/haierp1/outerOrder/querySalesName', { data: payload }).catch(e => e);
const reviewOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/review', { data: payload }).catch(e => e);
const reviewOrderList = ({ payload }) => fetch.post('/haierp1/outerOrder/reviewList', { data: payload }).catch(e => e);
// erp
const queryErpOrderList = ({ payload }) => fetch.post('/haierp1/erpOrder/query', { data: payload }).catch(e => e);
const splitOrder = ({ payload }) => fetch.post('/haierp1/erpOrder/split', { data: payload }).catch(e => e);
// 批量发货
const multiDelivery = ({ payload }) => fetch.post('/haierp1/shippingOrder/multiDelivery', { data: payload }).catch(e => e);
// 发货单查询
const queryShippingOrderList = ({ payload }) => fetch.post('/haierp1/shippingOrder/query', { data: payload }).catch(e => e);
// 发货单详情表单查询
const queryShippingOrderDetail = ({ payload }) => fetch.post('/haierp1/shippingOrder/multiDeliveryForm', { data: payload }).catch(e => e);

export default {
  namespace: 'order',
  state: {
    orderList: [],
    orderTotal: 1,
    orderSkuSnip: {},
    currentPage: 1,
    orderValues: {},
    salesName: [],
    // erp
    erpOrderList: [],
    erpCurrentPage: 1,
    erpOrderTotal: 1,
    erpOrderDetail: {},
    // 发货单
    shippingOrderList: [],
    shippingCurrentPage: 1,
    shippingOrderTotal: 1,
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
    // erp
    saveErpCurrentPage(state, { payload }) {
      return { ...state, erpCurrentPage: payload.pageIndex };
    },
    saveErpOrderList(state, { payload }) {
      return { ...state, erpOrderList: payload.data, erpOrderTotal: payload.totalCount };
    },
    saveErpOrderDetail(state, { payload }) {
      return { ...state, erpOrderDetail: payload.data || {} };
    },
    // 发货单
    saveShippingCurrentPage(state, { payload }) {
      return { ...state, shippingCurrentPage: payload.pageIndex };
    },
    saveShippingOrderList(state, { payload }) {
      return { ...state, shippingOrderList: payload.data, shippingOrderTotal: payload.totalCount };
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
      if (!payload.status) payload.status = 0;
      const data = yield call(queryOrderList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'saveOrderList',
          payload: data,
        });
      }
    },
    * queryErpOrderList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ order }) => order.erpCurrentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveErpCurrentPage', payload });
      }
      // if (payload.startGmt) payload.startGmt = payload.startGmt.format('YYYY-MM-DD');
      // if (payload.endGmt) payload.endGmt = payload.endGmt.format('YYYY-MM-DD');
      const data = yield call(queryErpOrderList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'saveErpOrderList',
          payload: data,
        });
      }
    },
    * queryErpOrderDetail({ payload }, { call, put }) {
      const data = yield call(queryShippingOrderDetail, { payload: { erpOrderId: JSON.stringify(payload.erpOrderId) } });
      if (data.success) {
        yield put({
          type: 'saveErpOrderDetail',
          payload: data,
        });
        if (payload.callback) payload.callback();
      }
    },
    * queryShippingOrderList({ payload }, { call, put, select }) {
      let pageIndex = yield select(({ order }) => order.shippingCurrentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveShippingCurrentPage', payload });
      }
      // if (payload.startGmt) payload.startGmt = payload.startGmt.format('YYYY-MM-DD');
      // if (payload.endGmt) payload.endGmt = payload.endGmt.format('YYYY-MM-DD');
      const data = yield call(queryShippingOrderList, { payload: { ...payload, pageIndex } });
      if (data.success) {
        yield put({
          type: 'saveShippingOrderList',
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
      if (payload.keyword.itemName) { param.itemName = payload.keyword.itemName; }
      const data = yield call(querySkuList, { payload: param });
      payload.callback(data.success ? data : 'ERROR');
    },
    * reviewOrder({ payload }, { call, put }) {
      const data = yield call(reviewOrder, { payload });
      if (data.success) {
        message.success('审核完成');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * reviewOrderList({ payload }, { call, put }) {
      const data = yield call(reviewOrderList, { payload });
      if (data.success) {
        message.success('审核完成');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * multiDelivery({ payload, callback }, { call, put }) {
      const data = yield call(multiDelivery, { payload });
      if (data.success) {
        message.success('批量发货完成');
        console.log(location); // 这里要跳转页面
        if (callback) callback();
        yield put({
          type: 'queryShippingOrderList',
          payload: {},
        });
      }
    },
    * splitOrder({ payload, success }, { call }) {
      const data = yield call(splitOrder, { payload });
      if (data.success) {
        message.success('拆分成功');
        success({ success: true });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/sale/orderList') {
          setTimeout(() => {
            dispatch({ type: 'queryOrderList', payload: query });
            dispatch({ type: 'agency/queryAgencyList', payload: query });
          }, 0);
        }
        if (pathname === '/sale/erpOrder') {
          setTimeout(() => {
            dispatch({ type: 'queryErpOrderList', payload: query });
          }, 0);
        }
        if (pathname === '/sale/shippingOrder') {
          setTimeout(() => {
            dispatch({ type: 'queryShippingOrderList', payload: query });
          }, 0);
        }
      });
    },
  },
};
