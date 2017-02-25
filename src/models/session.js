import { message } from 'antd';
import { routerCfg } from '../constants';
import { login } from '../services/session';

export default {
  namespace: 'session',
  state: {
    dataSource: [],
  },
  effects: {
    * login(payload, { call }) {
      const data = yield call(login, payload);
      if (data.success) {
        window.redirector(`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`);
      } else message.error(data.data);
    },
  },
};
