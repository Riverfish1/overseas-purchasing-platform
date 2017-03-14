import { message } from 'antd';
import {
  addCate,
  queryCateList,
  updateCate,
  deleteCate,
  queryCate,
} from '../services/category';

export default {
  namespace: 'cate',
  state: {
    cateList: [],
    cate: {},
  },
  reducers: {
    saveCateList(state, { payload }) {
      return { ...state, cateList: payload };
    },
    saveCate(state, { payload }) {
      return { ...state, cate: payload };
    },
  },
  effects: {
    * addCate({ payload }, { call, put }) { // 新建SKU
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'undefined' || payload[key] === null) delete payload[key];
      });
      const data = yield call(addCate, { payload });
      if (data.success) {
        message.success('新增类目成功');
        yield put({
          type: 'queryCateList',
          payload: {},
        });
      }
    },
    * queryCate({ payload }, { call, put }) {
      const data = yield call(queryCate, { payload });
      if (data.success) {
        yield put({
          type: 'saveCate',
          payload: data,
        });
      }
    },
    * updateCate({ payload }, { call, put }) {
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === 'undefined' || payload[key] === null) delete payload[key];
      });
      const data = yield call(updateCate, { payload });
      if (data.success) {
        message.success('修改类目成功');
        yield put({
          type: 'queryCateList',
          payload: {},
        });
      }
    },
    * queryCateList({ payload }, { call, put }) { // 类目管理列表
      const data = yield call(queryCateList, { payload });
      if (data.success) {
        yield put({
          type: 'saveCateList',
          payload: data,
        });
      }
    },
    * deleteCate({ payload }, { call, put }) {
      const data = yield call(deleteCate, { payload });
      if (data.success) {
        message.success('删除类目成功');
        yield put({
          type: 'queryCateList',
          payload: {},
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/products/cateList') {
          setTimeout(() => {
            dispatch({ type: 'queryCateList', payload: query });
          }, 0);
        }
      });
    },
  },
};
