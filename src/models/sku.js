import { message } from 'antd';
import fetch from '../utils/request';

const addSku = ({ payload }) => fetch.post('/haierp1/itemSku/add', { data: payload }).catch(e => e);
const updateSku = ({ payload }) => fetch.post('/haierp1/itemSku/update', { data: payload }).catch(e => e);
const querySku = ({ payload }) => fetch.post('/haierp1/itemSku/query', { data: payload }).catch(e => e);
const querySkuList = ({ payload }) => fetch.post('/haierp1/itemSku/queryItemSkuList', { data: payload }).catch(e => e);
const deleteSku = ({ payload }) => fetch.post('/haierp1/itemSku/delete', { data: payload }).catch(e => e);
const queryPackageScales = () => fetch.post('/haierp1/freight/getPackageScaleList').catch(e => e);
const queryScaleTypes = () => fetch.post('/haierp1/itemSku/scaleTypeList').catch(e => e);
const queryItemList = ({ payload }) => fetch.post('/haierp1/item/queryItemList', { data: payload }).catch(e => e);

export default {
  namespace: 'sku',
  state: {
    skuList: [],
    skuTotal: 0,
    skuData: {},
    currentPage: 1,
    packageScales: [],
    scaleTypes: [],
  },
  reducers: {
    saveSku(state, { payload }) {
      return { ...state, skuData: payload };
    },
    saveItemSkuList(state, { payload }) {
      return { ...state, skuList: payload.data, skuTotal: payload.totalCount };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    savePackageScales(state, { payload }) {
      console.log(payload);
      // 预处理数据
      return {
        ...state,
        packageScales: payload.data.data.map((el) => {
          el.label = el.name;
          el.value = el.id;
          el.children = el.packageLevels;
          el.children.forEach((child) => {
            child.label = child.name;
            child.value = child.id;
          });
          return el;
        }),
      };
    },
    saveScaleTypes(state, { payload }) {
      return { ...state, scaleTypes: payload.data.data };
    },
  },
  effects: {
    * addSku({ payload }, { call, put }) { // 新建SKU
      const data = yield call(addSku, { payload });
      if (data.success) {
        message.success('新增订单成功');
        yield put({
          type: 'querySkuList',
          payload: {},
        });
      }
    },
    * updateSku({ payload }, { call, put }) {
      const data = yield call(updateSku, { payload });
      if (data.success) {
        message.success('更新订单成功');
        yield put({
          type: 'querySkuList',
          payload: {},
        });
      }
    },
    * querySku({ payload }, { call, put }) {
      const data = yield call(querySku, { payload });
      if (data.success) {
        try {
          data.data.mainPic = JSON.parse(decodeURIComponent(data.data.mainPic).replace(/&quot;/g, '"'));
        } catch (e) {
          data.data.mainPic = {};
        }
        yield put({
          type: 'saveSku',
          payload: data,
        });
      }
    },
    * querySkuList({ payload = {} }, { call, put, select }) { // SKU管理列表
      let pageIndex = yield select(({ sku }) => sku.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      const data = yield call(querySkuList, { payload: { ...payload, pageIndex } });
      console.log('querySkuList success', data);
      if (data.success) {
        yield put({
          type: 'saveItemSkuList',
          payload: data,
        });
      }
    },
    * deleteSku({ payload }, { call, put, select }) {
      const data = yield call(deleteSku, { payload });
      if (data.success) {
        message.success('删除SKU成功');
        const sku = yield select(model => model.sku);
        if (sku.skuList.length < 2 && sku.currentPage > 1) {
          yield put({
            type: 'querySkuList',
            payload: { pageIndex: sku.currentPage - 1 },
          });
          return;
        }
        yield put({
          type: 'querySkuList',
          payload: {},
        });
      }
    },
    * searchProducts({ payload }, { call }) {
      const data = yield call(queryItemList, { payload: { name: payload.keyword } });
      payload.callback(data.success ? data : 'ERROR');
    },
    * queryPackageScales(param, { call, put }) {
      const data = yield call(queryPackageScales);
      if (data.success) {
        yield put({
          type: 'savePackageScales',
          payload: { data },
        });
      }
    },
    * queryScaleTypes(param, { call, put }) {
      const data = yield call(queryScaleTypes);
      if (data.success) {
        yield put({
          type: 'saveScaleTypes',
          payload: { data },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/products/skuList') {
          setTimeout(() => {
            dispatch({ type: 'querySkuList', payload: query });
            dispatch({ type: 'products/queryCatesTree', payload: query });
            dispatch({ type: 'products/queryBrands', payload: {} });
            dispatch({ type: 'products/queryItemList', payload: {} });
          }, 0);
        }
      });
    },
  },
};
