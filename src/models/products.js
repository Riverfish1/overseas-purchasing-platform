import { 
  queryItemList, // 获取商品列表
  updateProducts, // 修改商品
  queryProduct, // 查询单个商品，修改之前调用
  addProducts, // 增加商品
  queryBrands, // 获取品牌
  queryCates, // 获取类目
  addSku,
  addCate,
  querySkuList,
  queryCateList,
} from '../services/products';

export default {
  namespace: 'products',
  state: {
    product: {
      productsList: [],
      updateProductsValues: '', // 修改商品时的值
      brands: '', // 品牌
    },
    skuList: [],
    cateList: [],
  },
  reducers: {
    saveProducts(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    saveSku(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    saveCate(state, { payload: dataSource }) {
      return { ...state, ...dataSource };
    },
    savaItemList(state, { payload: data }) {
      const product = { ...product, productsList: data };
      return { ...state, product };
    },
    savaSkuList(state, { payload: data }) {
      return { ...state, skuList: data };
    },
    savaCateList(state, { payload: data }) {
      return { ...state, cateList: data };
    },
    saveBrands(state, { payload: data }) { // 保存品牌
      return { ...state, brands: data };
    },
    savaUpdateProducts(state, { payload: data }) {
      const product = { ...product, updateProductsValues: data };
      return { ...state, product };
    }
  },
  effects: {
    * addProducts({ payload }, { call, put }) { // 新建商品
      const { data } = yield call(addProducts, { payload });
      if (data.success) {
        yield put({
          type: 'saveProducts',
          payload: {
            dataSource: data.dataSource,
          },
        });
      }
    },
    * queryProduct({ payload }, { call, put }) { // 修改商品
      const { data } = yield call(queryProduct, { payload });
      console.log('queryProduct success', data);
      if (data.success) {
        yield put({
          type: 'savaUpdateProducts',
          payload: data,
        });
      }
    },
    * updateProducts({ payload }, { call, put }) { // 修改商品
      const { data } = yield call(updateProducts, { payload });
      console.log('updateProducts success', data);
      if (data.success) {
        yield put({
          type: 'queryItemList',
        });
      }
    },
    * queryItemList({ payload }, { call, put }) { // 商品管理列表
      const { data } = yield call(queryItemList, { payload });
      console.log('queryItemList success', data);
      if (data.success) {
        yield put({
          type: 'savaItemList',
          payload: data,
        });
      }
    },
    * queryBrands({ payload }, { call, put }) { // 获取品牌
      const { data } = yield call(queryBrands);
      console.log('queryBrands success', data);
      if (data.success) {
        yield put({
          type: 'saveBrands',
          payload: data,
        });
      }
    },
    * queryCates({ payload }, { call, put }) { // 获取类目
      const { data } = yield call(queryCates);
      console.log('queryCates success', data);
      if (data.success) {
        yield put({
          type: 'saveCates',
          payload: data,
        });
      }
    },
    * addSku({ payload }, { call, put }) { // 新建SKU
      const { data } = yield call(addSku, { payload });
      if (data.success) {
        yield put({
          type: 'saveSku',
          payload: {
            dataSource: data.dataSource,
          },
        });
      }
    },
    * addCate({ payload }, { call, put }) { // 新建类目
      const { data } = yield call(addCate, { payload });
      if (data.success) {
        yield put({
          type: 'saveCate',
          payload: {
            dataSource: data.dataSource,
          },
        });
      }
    },
    * querySkuList({ payload }, { call, put }) { // SKU管理列表
      const { data } = yield call(querySkuList, { payload });
      if (data.success) {
        yield put({
          type: 'savaSkuList',
          payload: data,
        });
      }
    },
    * queryCateList({ payload }, { call, put }) { // 类目管理列表
      const { data } = yield call(queryCateList, { payload });
      if (data.success) {
        yield put({
          type: 'savaCateList',
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
          dispatch({ type: 'queryBrands' });
          dispatch({ type: 'queryCates' });
        }
        if (pathname === '/products/skuList') {
          dispatch({ type: 'querySkuList', payload: query });
        }
        if (pathname === '/products/cateList') {
          dispatch({ type: 'queryCateList', payload: query });
        }
      });
    },
  },
};
