import { message } from 'antd';
import { backendCfg, routerCfg, setNavigation, originalNavigation } from '../constants';
import fetch from '../utils/request';

const login = ({ payload }) => fetch.post('/haierp1/haiLogin/login', { data: payload }).catch(e => e);
const queryPermissions = () => fetch.post('/haierp1/user/resCodes').catch(e => e);

export default {
  namespace: 'session',
  state: {
    dataSource: [],
  },
  effects: {
    * login(payload, { call }) {
      const data = yield call(login, payload);
      if (data.success) {
        const permissionData = yield call(queryPermissions);
        // 先处理权限
        if (permissionData.success) {
          const permissions = [...permissionData.data, routerCfg.OVERVIEW];
          const newNavigation = [];
          originalNavigation.forEach((el) => {
            if (permissions.indexOf(backendCfg[el.key]) === -1) {
              return;
            }
            if (!el.child || el.child.length === 0) {
              newNavigation.push(el);
              return;
            }
            // 有子代的，还要判断子代
            const child = el.child;
            const newChild = [];
            child.forEach((c) => {
              if (permissions.indexOf(backendCfg[c.key]) >= 0) {
                newChild.push(c);
              }
            });
            const newEl = { ...el, child: newChild };
            newNavigation.push(newEl);
          });

          setNavigation(newNavigation);

          localStorage.setItem('HAIERP_LAST_LOGIN', new Date().getTime());
          localStorage.setItem('HAIERP_LAST_PERMISSION', JSON.stringify(newNavigation));
          window.redirector(`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`);
        }
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
