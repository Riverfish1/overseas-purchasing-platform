import { message } from 'antd';
import fetch from '../utils/request';

const queryItemList = ({ payload }) => fetch.post('/haierp1/item/queryItemList', { data: payload }).catch(e => e);
const queryProduct = ({ payload }) => fetch.post('/haierp1/item/query', { data: payload }).catch(e => e);
const updateProducts = ({ payload }) => fetch.post('/haierp1/item/update', { data: payload }).catch(e => e);
const addProducts = ({ payload }) => fetch.post('/haierp1/item/add', { data: payload }).catch(e => e);
const queryBrands = () => fetch.post('/haierp1/item/brand/queryBrands').catch(e => e);
const queryCatesTree = () => fetch.post('/haierp1/category/tree').catch(e => e);

export default {
  namespace: 'products',
  state: {
    productsList: [],
    productsTotal: 0,
    productsValues: {}, // 修改商品时的值
    currentPage: 1, // 默认页码
    brands: [], // 品牌
    tree: [], // 类目树
    searchValues: {},
  },
  reducers: {
    saveCatesTree(state, { payload }) {
      return { ...state, tree: payload.data };
    },
    saveItemList(state, { payload }) {
      return { ...state, productsList: payload.rows, productsTotal: payload.total };
    },
    saveBrands(state, { payload }) { // 保存品牌
      return { ...state, brands: payload.data };
    },
    saveProductsValue(state, { payload }) {
      return { ...state, productsValues: payload };
    },
    saveCurrentPage(state, { payload }) {
      return { ...state, currentPage: payload.pageIndex };
    },
    saveSearchValues(state, { payload }) {
      return { ...state, searchValues: payload };
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
    * updateProducts({ payload }, { call, put, select }) { // 修改商品
      const data = yield call(updateProducts, { payload });
      console.log('updateProducts success', data);
      if (data.success) {
        message.success('修改商品成功');
        const values = yield select(({ products }) => products.searchValues);
        yield put({
          type: 'queryItemList',
          payload: { ...values },
        });
      }
    },
    * queryItemList({ payload = {} }, { call, put, select }) { // 商品管理列表
      let pageIndex = yield select(({ products }) => products.currentPage);
      if (payload && payload.pageIndex) {
        pageIndex = payload.pageIndex;
        yield put({ type: 'saveCurrentPage', payload });
      }
      if (payload.startDate) payload.startDate = payload.startDate.format('YYYY-MM-DD');
      if (payload.endDate) payload.endDate = payload.endDate.format('YYYY-MM-DD');
      const data = yield call(queryItemList, { payload: { ...payload, pageIndex } });
      console.log('queryItemList success', data);
      if (data.success) {
        yield put({
          type: 'saveItemList',
          payload: data,
        });
      }
    },
    * queryBrands(param, { call, put }) { // 获取品牌
      const data = yield call(queryBrands);
      console.log('queryBrands success', data);
      if (data.success) {
        yield put({
          type: 'saveBrands',
          payload: data,
        });
      }
    },
    * queryCatesTree(param, { call, put }) {
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
