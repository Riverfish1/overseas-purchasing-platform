import React from 'react';
import { Router, IndexRoute, Route, Redirect } from 'dva/router';
import { routerCfg } from './constants';

// 视图组件
import MainLayout from './layouts/Main';
import Login from './components/Login';
import Overview from './components/Overview';
import Products from './components/Products/Products';
import Sku from './components/Sku/Sku';
import Category from './components/Category/Category';
import Order from './components/Order/Order';

function redirectHelper(...args) {
  // 传入参数3，为onEnter
  const len = args.length;
  const { location } = args[len - 3];
  const replace = args[len - 2];
  const callback = args[len - 1];
  console.log('redirect');
  if (!localStorage.getItem('HAIERP_LAST_LOGIN') && location.pathname !== `/${routerCfg.LOGIN}`) replace(`/${routerCfg.LOGIN}`);
  callback();
}

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route
        path="/"
        component={MainLayout}
        onEnter={redirectHelper}
        onChange={redirectHelper}
      >
        <IndexRoute component={Login} />
        <Route path={`/${routerCfg.LOGIN}`} component={Login} />
        <Route path={`/${routerCfg.OVERVIEW}`} component={Overview} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`} component={Products} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.SKU_LIST}`} component={Sku} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.CATE_LIST}`} component={Category} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.ORDER_LIST}`} component={Order} />
        {/* 重定向 */}
        <Redirect from={`/${routerCfg.PRODUCTS}`} to={`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
