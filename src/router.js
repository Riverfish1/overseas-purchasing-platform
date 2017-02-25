import React from 'react';
import { Router } from 'dva/router';
import { routerCfg } from './constants';

// 视图组件
import MainLayout from './layouts/Main';
import Login from './components/Login';
import Overview from './components/Overview';
import Products from './components/Products/Products';
import Sku from './components/Sku/Sku';
import Category from './components/Category/Category';

function RouterConfig({ history }) {
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
        component: Products,
      },
      {
        path: `/${routerCfg.PRODUCTS}/${routerCfg.SKU_LIST}`,
        component: Sku,
      },
      {
        path: `/${routerCfg.PRODUCTS}/${routerCfg.CATE_LIST}`,
        component: Category,
      },
    ],
  };

  return <Router history={history} routes={routes} />;
}

export default RouterConfig;
