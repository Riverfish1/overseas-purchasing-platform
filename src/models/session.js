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
        localStorage.setItem('HAIERP_LAST_LOGIN', new Date().getTime());
        window.redirector(`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`);
      } else message.error(data.data);
    },
  },
  subscriptions: {
    setup({ history }) {
      return history.listen(({ pathname }) => {
        if (pathname === `/${routerCfg.LOGIN}`) {
          localStorage.removeItem('HAIERP_LAST_LOGIN');
        }
      });
    },
  },
};
