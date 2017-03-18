/* eslint-disable object-property-newline */
export const API_URL = 'http://118.178.126.143/haierp1/haiLogin';

// 路由字符串常量配置
export const routerCfg = {
  // 登录
  LOGIN: 'login',
  // 总览
  OVERVIEW: 'overview',
  // 商品管理
  PRODUCTS: 'products',
  PRODUCTS_LIST: 'productsList',
  SKU_LIST: 'skuList',
  CATE_LIST: 'cateList',
  // 销售管理
  SALE: 'sale',
  ORDER_LIST: 'orderList',
  // 采购管理
  PURCHASE: 'purchase',
  PURCHASE_LIST: 'purchaseList',
  PURCHASE_STOCK_IN: 'purchaseStockIn',

  // 客户管理
  AGENCY: 'agency',
  AGENCY_LIST: 'agencyList',
};

export const navigation = [
  { key: routerCfg.OVERVIEW, name: '总览', icon: 'laptop' },
  { key: routerCfg.PRODUCTS, name: '商品管理', icon: 'bars',
    child: [
      { key: routerCfg.PRODUCTS_LIST, name: '商品列表' },
      { key: routerCfg.SKU_LIST, name: 'SKU管理' },
      { key: routerCfg.CATE_LIST, name: '类目管理' },
    ],
  },
  { key: routerCfg.SALE, name: '销售管理', icon: 'book',
    child: [
      { key: routerCfg.ORDER_LIST, name: '订单管理' },
    ],
  },
  {
    key: routerCfg.PURCHASE, name: '采购管理', icon: 'appstore-o',
    child: [
      { key: routerCfg.PURCHASE_LIST, name: '采购管理' },
      { key: routerCfg.PURCHASE_STOCK_IN, name: '采购入库管理' },
    ],
  },
  {
    key: routerCfg.AGENCY, name: '客户管理', icon: 'user',
    child: [
      { key: routerCfg.AGENCY_LIST, name: '经销商管理' },
    ],
  },
];
