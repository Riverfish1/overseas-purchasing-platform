import React from 'react';
import { Router, IndexRoute, Route, Redirect } from 'dva/router';
import { routerCfg } from './constants';

// 视图组件
import MainLayout from './layouts/Main';
import Login from './components/Login';
import Overview from './components/Overview';
import Products from './components/Products/Products';
import PackageScale from './components/Products/PackageScale';
import PackageLevel from './components/Products/PackageLevel';
import Sku from './components/Sku/Sku';
import Category from './components/Category/Category';
import Order from './components/Order/Order';
import ErpOrder from './components/Order/ErpOrder';
import ShippingOrder from './components/Order/ShippingOrder';
import Purchase from './components/Purchase/Purchase'; // 采购管理
import PurchaseStorage from './components/Purchase/PurchaseStorage'; // 采购入库管理
// import Journal from './components/Check/Journal'; // 流水管理
// import Receipt from './components/Check/Receipt'; // 小票管理
import Agency from './components/Agency/Agency';
import AgencyType from './components/Agency/AgencyType';
import Inventory from './components/Inventory/Inventory';
import Warehouse from './components/System/Warehouse'; // 仓库管理

function redirectHelper(...args) {
  // 传入参数3，为onEnter
  const len = args.length;
  const { location } = args[len - 3];
  const replace = args[len - 2];
  const callback = args[len - 1];
  const lastLoginTime = parseInt(localStorage.getItem('HAIERP_LAST_LOGIN') || 0, 10);
  const isTimeout = new Date().getTime() - lastLoginTime > (15 * 60 * 1000) - 10000; // 15分钟超时
  if (isTimeout && location.pathname !== `/${routerCfg.LOGIN}`) replace(`/${routerCfg.LOGIN}`);
  else if (location.pathname === '/') replace(`/${routerCfg.OVERVIEW}`);
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
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.PACKAGE_SCALE}`} component={PackageScale} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.PACKAGE_LEVEL}`} component={PackageLevel} />
        <Route path={`/${routerCfg.PRODUCTS}/${routerCfg.CATE_LIST}`} component={Category} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.ORDER_LIST}`} component={Order} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.ERP_ORDER}`} component={ErpOrder} />
        <Route path={`/${routerCfg.SALE}/${routerCfg.SHIPPING_ORDER}`} component={ShippingOrder} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.PURCHASE_LIST}`} component={Purchase} />
        <Route path={`/${routerCfg.PURCHASE}/${routerCfg.PURCHASE_STORAGE}`} component={PurchaseStorage} />
        {/* <Route path={`/${routerCfg.PURCHASE}/${routerCfg.CHECK}/${routerCfg.JOURNAL}`} component={Journal} /> */}
        {/* <Route path={`/${routerCfg.PURCHASE}/${routerCfg.CHECK}/${routerCfg.RECEIPT}`} component={Receipt} /> */}
        <Route path={`/${routerCfg.PERSON}/${routerCfg.AGENCY_LIST}`} component={Agency} />
        <Route path={`/${routerCfg.PERSON}/${routerCfg.AGENCY_TYPE}`} component={AgencyType} />
        <Route path={`/${routerCfg.INVENTORY}/${routerCfg.INVENTORY_LIST}`} component={Inventory} />
        <Route path={`/${routerCfg.SYSTEM}/${routerCfg.WAREHOUSE}`} component={Warehouse} />
        {/* 一级导航重定向 */}
        <Redirect from={`/${routerCfg.PRODUCTS}`} to={`/${routerCfg.PRODUCTS}/${routerCfg.PRODUCTS_LIST}`} />
        <Redirect from={`/${routerCfg.SALE}`} to={`/${routerCfg.SALE}/${routerCfg.ORDER_LIST}`} />
        <Redirect from={`/${routerCfg.PURCHASE}`} to={`/${routerCfg.PURCHASE}/${routerCfg.PURCHASE_LIST}`} />
        <Redirect from={`/${routerCfg.PERSON}`} to={`/${routerCfg.PERSON}/${routerCfg.AGENCY_LIST}`} />
        <Redirect from={`/${routerCfg.INVENTORY}`} to={`/${routerCfg.INVENTORY}/${routerCfg.INVENTORY_LIST}`} />
        <Redirect from={`/${routerCfg.SYSTEM}`} to={`/${routerCfg.SYSTEM}/${routerCfg.WAREHOUSE}`} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
