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
  PRE_STOCK: 'preStock',
  // PURCHASE_STOCK_IN: 'purchaseStockIn',

  // 客户管理
  PERSON: 'person',
  AGENCY_LIST: 'agencyList',
  AGENCY_TYPE: 'agencyType',
  // SUPPLIER_LIST: 'supplierList',
  // 库存管理
  INVENTORY: 'inventory',
  INVENTORY_LIST: 'inventoryList',
  // 系统管理
  SYSTEM: 'system',
  WAREHOUSE: 'warehouse', // 仓库管理
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
  { key: routerCfg.PURCHASE, name: '采购管理', icon: 'appstore-o',
    child: [
      { key: routerCfg.PURCHASE_LIST, name: '采购管理' },
      { key: routerCfg.PRE_STOCK, name: '盘点管理' },
      // { key: routerCfg.PURCHASE_STOCK_IN, name: '采购入库管理' },
    ],
  },
  { key: routerCfg.PERSON, name: '客户管理', icon: 'user',
    child: [
      { key: routerCfg.AGENCY_LIST, name: '经销商管理' },
      { key: routerCfg.AGENCY_TYPE, name: '经销商分类' },
      // { key: routerCfg.SUPPLIER_LIST, name: '供应商管理' },
    ],
  },
  { key: routerCfg.INVENTORY, name: '库存管理', icon: 'shopping-cart',
    child: [
      { key: routerCfg.INVENTORY_LIST, name: '库存管理' },
    ],
  },
  { key: routerCfg.SYSTEM, name: '系统管理', icon: 'barcode',
    child: [
      { key: routerCfg.WAREHOUSE, name: '仓库管理' },
    ],
  },
];
