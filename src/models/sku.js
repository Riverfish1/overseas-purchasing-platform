import { message } from 'antd';
import { addSku, querySkuList, updateSku, querySku, deleteSku, queryPackageScales, queryScaleTypes } from '../services/sku';
import { queryItemList } from '../services/products';

export default {
  namespace: 'sku',
  state: {
    skuList: {},
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
      return { ...state, skuList: payload };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    savePackageScales(state, { payload }) {
      // 预处理数据
      return {
        ...state,
        packageScales: payload.data.data.map((el) => {
          el.label = el.name;
          el.value = el.id;
          el.children = el.packageList;
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
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'undefined' || payload[key] === null) delete payload[key];
      });
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
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'undefined' || payload[key] === null) delete payload[key];
      });
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
    * deleteSku({ payload }, { call, put }) {
      const data = yield call(deleteSku, { payload });
      if (data.success) {
        message.success('删除SKU成功');
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
