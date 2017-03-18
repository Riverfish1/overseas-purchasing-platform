import { message } from 'antd';

import {
  queryItemList, // 获取商品列表
  updateProducts, // 修改商品
  queryProduct, // 查询单个商品，修改之前调用
  addProducts, // 增加商品
  queryBrands, // 获取品牌
  queryCatesTree, // 获取类目
} from '../services/products';

export default {
  namespace: 'products',
  state: {
    productsList: [],
    productsTotal: 0,
    productsValues: {}, // 修改商品时的值
    currentPage: 1, // 默认页码
    brands: [], // 品牌
    tree: [], // 类目树
  },
  reducers: {
    saveCatesTree(state, { payload: data }) {
      return { ...state, tree: data.data };
    },
    saveItemList(state, { payload: data }) {
      return { ...state, productsList: data.rows, productsTotal: data.total };
    },
    saveBrands(state, { payload: data }) { // 保存品牌
      return { ...state, brands: data.data };
    },
    saveProductsValue(state, { payload: data }) {
      return { ...state, productsValues: data };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
  },
  effects: {
    * addProducts({ payload }, { call, put }) { // 新建商品
      const data = yield call(addProducts, { payload });
      if (data.success) {
        message.success('新增商品成功');
        yield put({
          type: 'queryItemList',
          payload: {},
        });
      }
    },
    * queryProduct({ payload }, { call, put }) { // 修改商品
      const data = yield call(queryProduct, { payload });
      console.log('queryProduct success', data);
      if (data.success) {
        // 处理图片缩略图
        if (data.data.mainPic && data.data.mainPic !== '0') {
          const picStr = decodeURIComponent(data.data.mainPic).replace(/&quot;/g, '"');
          console.log(picStr);
          console.log(data.data.mainPic);
          const picObj = JSON.parse(picStr);
          picObj.picList.forEach((el) => {
            el.thumbUrl = `${el.url}?x-oss-process=image/resize,w_200,limit_0`;
          });
          // 写回去
          data.data.mainPic = JSON.stringify(picObj);
        }
        yield put({
          type: 'saveProductsValue',
          payload: data,
        });
      }
    },
    * updateProducts({ payload }, { call, put }) { // 修改商品
      const data = yield call(updateProducts, { payload });
      console.log('updateProducts success', data);
      if (data.success) {
        message.success('修改商品成功');
        yield put({
          type: 'queryItemList',
          payload: {},
        });
      }
    },
    * queryItemList({ payload = {} }, { call, put, select }) { // 商品管理列表
      let pageIndex = yield select(({ products }) => products.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      if (payload.startGmt) payload.startGmt = payload.startGmt.format('YYYY-MM-DD');
      if (payload.endGmt) payload.endGmt = payload.endGmt.format('YYYY-MM-DD');
      const data = yield call(queryItemList, { payload: { ...payload, pageIndex } });
      console.log('queryItemList success', data);
      if (data.success) {
        yield put({
          type: 'saveItemList',
          payload: data,
        });
      }
    },
    * queryBrands({ payload }, { call, put }) { // 获取品牌
      const data = yield call(queryBrands);
      console.log('queryBrands success', data);
      if (data.success) {
        yield put({
          type: 'saveBrands',
          payload: data,
        });
      }
    },
    * queryCatesTree({ payload }, { call, put }) {
      const data = yield call(queryCatesTree);
      console.log('queryCatesTree success', data);
      if (data.success) {
        yield put({
          type: 'saveCatesTree',
          payload: data,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/products/productsList') {
          setTimeout(() => {
            dispatch({ type: 'queryItemList', payload: { pageIndex: 1 } });
            dispatch({ type: 'queryBrands', payload: query });
            dispatch({ type: 'queryCatesTree', payload: query });
          }, 0);
        }
        if (pathname === '/products/productsList' || pathname === '/products/skuList') {
          setTimeout(() => {
            dispatch({ type: 'sku/queryPackageScales', payload: query });
            dispatch({ type: 'sku/queryScaleTypes', payload: query });
          }, 0);
        }
      });
    },
  },
};
