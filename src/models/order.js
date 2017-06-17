import { message } from 'antd';
import fetch from '../utils/request';

const addOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/add', { data: payload }).catch(e => e);
const updateOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/update', { data: payload }).catch(e => e);
const deleteOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/delete', { data: payload }).catch(e => e);
const queryOrderList = ({ payload }) => fetch.post('/haierp1/outerOrder/queryOuterOrderList', { data: payload }).catch(e => e);
const queryOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/query', { data: payload }).catch(e => e);
const confirmOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/confirm', { data: payload }).catch(e => e);
const closeOrder = ({ payload }) => fetch.post('/haierp1/outerOrder/close', { data: payload }).catch(e => e);
// erp
const queryErpOrderList = ({ payload }) => fetch.post('/haierp1/erpOrder/query', { data: payload }).catch(e => e);
// erp订单查询
const queryErpOrder = ({ payload }) => fetch.post('/haierp1/erpOrder/queryById', { data: payload }).catch(e => e);
// erp订单修改
const updateErpOrder = ({ payload }) => fetch.post('/haierp1/erpOrder/update', { data: payload }).catch(e => e);
// 订单关闭
const closeErpOrder = ({ payload }) => fetch.post('/haierp1/erpOrder/close', { data: payload }).catch(e => e);
const splitOrder = ({ payload }) => fetch.post('/haierp1/erpOrder/splitErpOrder', { data: payload }).catch(e => e);
// 重分配库存
const replayAssign = ({ payload }) => fetch.post('/haierp1/erpOrder/replayAssign', { data: payload }).catch(e => e);
// 发货
const multiDelivery = ({ payload }) => fetch.post('/haierp1/shippingOrder/multiDelivery', { data: payload }).catch(e => e);
// 发货单查询
const queryShippingOrderList = ({ payload }) => fetch.post('/haierp1/shippingOrder/query', { data: payload }).catch(e => e);
const updateShippingOrder = ({ payload }) => fetch.post('/haierp1/shippingOrder/update', { data: payload }).catch(e => e);
// 发货单详情表单查询
const queryShippingOrderDetail = ({ payload }) => fetch.post('/haierp1/shippingOrder/multiDeliveryForm', { data: payload }).catch(e => e);
const queryDetail = ({ payload }) => fetch.post('/haierp1/shippingOrder/queryShippingOrderDetail', { data: payload }).catch(e => e);
// 查询物流公司
const queryDeliveryCompanyList = ({ payload }) => fetch.post('/haierp1/shippingOrder/queryLogisticCompany', { data: payload }).catch(e => e);
// 分配库存
const lockErpOrder = ({ payload }) => fetch.post('/haierp1/erpOrder/lockErpOrder', { data: payload }).catch(e => e);
// 释放库存
const releaseInventory = ({ payload }) => fetch.post('/haierp1/erpOrder/releaseInventory', { data: payload }).catch(e => e);

export default {
  namespace: 'order',
  state: {
    orderList: [],
    orderTotal: 1,
    orderSkuSnip: {},
    currentPage: 1,
    orderValues: {},
    // erp
    erpOrderList: [],
    erpCurrentPage: 1,
    erpOrderTotal: 1,
    erpOrderDetail: {},
    erpOrderValues: {},
    // 发货单
    shippingOrderList: [],
    shippingCurrentPage: 1,
    shippingOrderTotal: 1,
    // 物流公司列表
    deliveryCompanyList: [],
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
    // erp
    saveErpCurrentPage(state, { payload }) {
      return { ...state, erpCurrentPage: payload.pageIndex };
    },
    saveErpOrderList(state, { payload }) {
      return { ...state, erpOrderList: payload.data, erpOrderTotal: payload.totalCount };
    },
    saveErpOrder(state, { payload }) {
      return { ...state, erpOrderValues: payload };
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
    saveDeliveryCompanyList(state, { payload }) {
      return { ...state, deliveryCompanyList: payload.data };
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
      if (!payload.status) payload.status = 10;
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
    * queryErpOrder({ payload }, { call, put }) {
      const data = yield call(queryErpOrder, { payload });
      if (data.success) {
        yield put({
          type: 'saveErpOrder',
          payload: data,
        });
      }
    },
    * updateErpOrder({ payload }, { call, put }) {
      const data = yield call(updateErpOrder, { payload });
      if (data.success) {
        message.success('修改成功');
        yield put({
          type: 'queryErpOrderList',
          payload: {},
        });
      }
    },
    * replayAssign({ payload }, { call }) {
      const data = yield call(replayAssign, { payload: { orderIds: payload.orderIds } });
      if (data.success) {
        message.success('重新分配库存成功');
        if (payload.callback) payload.callback();
      }
    },
    * closeErpOrder({ payload }, { call }) {
      const data = yield call(closeErpOrder, { payload: { orderIds: payload.orderIds } });
      if (data.success) {
        message.success('关闭成功');
        if (payload.callback) payload.callback();
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
    * queryDetail({ payload, cb }, { call }) {
      const data = yield call(queryDetail, { payload });
      if (data.success) {
        if (cb) cb(data.data);
      }
    },
    * updateShippingOrder({ payload, callback }, { call, put }) {
      const data = yield call(updateShippingOrder, { payload });
      if (data.success) {
        message.success('修改发货单完成');
        if (callback) callback();
        yield put({
          type: 'queryShippingOrderList',
          payload: {},
        });
      }
    },
    * confirmOrder({ payload }, { call, put }) {
      const data = yield call(confirmOrder, { payload });
      if (data.success) {
        message.success('订单确认完成');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * closeOrder({ payload }, { call, put }) {
      const data = yield call(closeOrder, { payload });
      if (data.success) {
        message.success('订单关闭完成');
        yield put({
          type: 'queryOrderList',
          payload: {},
        });
      }
    },
    * multiDelivery({ payload, callback }, { call, put }) {
      const data = yield call(multiDelivery, { payload });
      if (data.success) {
        message.success('发货完成');
        if (callback) callback();
        yield put({
          type: 'queryErpOrderList',
          payload: {},
        });
      }
    },
    * splitOrder({ payload, success }, { call, put }) {
      const data = yield call(splitOrder, { payload });
      if (data.success) {
        message.success('订单拆分成功');
        yield put({
          type: 'queryErpOrderList',
          payload: {},
        });
      }
    },
    * queryDeliveryCompanyList(params, { call, put }) {
      const data = yield call(queryDeliveryCompanyList, {});
      if (data.success) {
        yield put({
          type: 'saveDeliveryCompanyList',
          payload: data,
        });
      }
    },
    exportPdf({ payload }) {
      window.open(`http://${location.host}/haierp1/shippingOrder/shippingOrderExportPdf?shippingOrderIds=${payload}`);
    },
    exportOrderDetail({ payload }) {
      if (payload.startOrderTime && payload.endOrderTime) {
        window.open(`http://${location.host}/haierp1/shippingOrder/shippingOrderExportExcel?startOrderTime=${payload.startOrderTime}&endOrderTime=${payload.endOrderTime}`);
      } else {
        message.error('请选择发货时间');
      }
    },
    * lockErpOrder(payload, { call, put }) {
      const data = yield call(lockErpOrder, payload);
      if (data.success) {
        message.success('分配库存成功');
        yield put({
          type: 'queryErpOrderList',
          payload: {},
        });
      }
    },
    * releaseInventory(payload, { call, put }) {
      const data = yield call(releaseInventory, payload);
      if (data.success) {
        message.success('释放库存成功');
        yield put({
          type: 'queryErpOrderList',
          payload: {},
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/sale/orderList' && !window.existCacheState('/sale/orderList')) {
          setTimeout(() => {
            dispatch({ type: 'queryOrderList', payload: query });
            dispatch({ type: 'agency/queryAgencyList', payload: query });
          }, 0);
        }
        if (pathname === '/sale/erpOrder' && !window.existCacheState('/sale/erpOrder')) {
          setTimeout(() => {
            dispatch({ type: 'queryErpOrderList', payload: query });
            dispatch({ type: 'agency/queryAgencyList', payload: query });
            dispatch({ type: 'queryDeliveryCompanyList', payload: query });
            dispatch({ type: 'inventory/queryWareList', payload: {} });
          }, 0);
        }
        if (pathname === '/sale/shippingOrder' && !window.existCacheState('/sale/shippingOrder')) {
          setTimeout(() => {
            dispatch({ type: 'queryShippingOrderList', payload: query });
            dispatch({ type: 'queryDeliveryCompanyList', payload: query });
          }, 0);
        }
      });
    },
  },
};
