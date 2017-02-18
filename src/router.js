import React from 'react';
import { Router } from 'dva/router';
import { routerCfg } from './constants';

// 视图组件
import MainLayout from './layouts/Main';
import Login from './components/Login';
import Overview from './components/Overview';
import Products from './components/Products/Products';

const cached = {};
function registerModel(app, model) {
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}

function RouterConfig({ history, app }) {
  const routes = {
    path: '/',
    component: MainLayout,
    indexRoute: { component: Login },
    onEnter(nextState, replace, callback) {
      // 请求权限码
      const { location } = nextState;
      if (location.pathname === '/') replace(`/${routerCfg.LOGIN}`);
      callback();
    },
    onChange(prev, nextState, replace, callback) {
      // 请求权限码
      const { location } = nextState;
      if (location.pathname === '/') replace(`/${routerCfg.LOGIN}`);
      callback();
    },
    childRoutes: [
      {
        path: `/${routerCfg.LOGIN}`,
        component: Login,
      },
      {
        path: `/${routerCfg.OVERVIEW}`,
        component: Overview,
      },
      {
        path: `/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`,
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            registerModel(app, require('./models/products'));
            cb(null, Products);
          });
        },
      },
    ],
  };

  return <Router history={history} routes={routes} />;
}

export default RouterConfig;
