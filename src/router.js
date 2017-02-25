import React from 'react';
import { Router, IndexRoute, Route } from 'dva/router';
import { routerCfg } from './constants';

// 视图组件
import MainLayout from './layouts/Main';
import Login from './components/Login';
import Overview from './components/Overview';
import Products from './components/Products/Products';
import Sku from './components/Sku/Sku';
import Category from './components/Category/Category';

const redirectHelper = ({ location }, replace, callback) => {
  console.log('redirect');
  if (location.pathname === '/') replace(`/${routerCfg.LOGIN}`);
  callback();
};

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
      </Route>
    </Router>
  );
}

export default RouterConfig;
