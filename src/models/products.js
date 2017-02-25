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
    productsValues: {}, // 修改商品时的值
    brands: [], // 品牌
    tree: [], // 类目树
  },
  reducers: {
    saveCatesTree(state, { payload: data }) {
      return { ...state, tree: data };
    },
    saveItemList(state, { payload: data }) {
      return { ...state, productsList: data };
    },
    saveBrands(state, { payload: data }) { // 保存品牌
      return { ...state, brands: data };
    },
    saveProductsValue(state, { payload: data }) {
      return { ...state, productsValues: data };
    }
  },
  effects: {
    * addProducts({ payload }, { call, put }) { // 新建商品
      const data = yield call(addProducts, { payload });
      if (data.success) {
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
        yield put({
          type: 'queryItemList',
          payload: {},
        });
      }
    },
    * queryItemList({ payload }, { call, put }) { // 商品管理列表
      const data = yield call(queryItemList, { payload });
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
          dispatch({ type: 'queryItemList', payload: query });
          dispatch({ type: 'queryBrands', payload: query });
          dispatch({ type: 'queryCatesTree', payload: query });
        }
      });
    },
  },
};
