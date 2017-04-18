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
  PACKAGE_SCALE: 'packageScale',
  PACKAGE_LEVEL: 'packageLevel',
  // 销售管理
  SALE: 'sale',
  ORDER_LIST: 'orderList',
  ERP_ORDER: 'erpOrder',
  // 采购管理
  PURCHASE: 'purchase',
  PURCHASE_LIST: 'purchaseList',
  PURCHASE_STORAGE: 'purchaseStorage',
  CHECK: 'check', // 盘点管理
  JOURNAL: 'journal', // 流水管理
  RECEIPT: 'receipt', // 小票管理
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
      { key: routerCfg.PACKAGE_SCALE, name: '包装规格类别' },
      { key: routerCfg.PACKAGE_LEVEL, name: '包装规格' },
    ],
  },
  { key: routerCfg.SALE, name: '销售管理', icon: 'book',
    child: [
      { key: routerCfg.ORDER_LIST, name: '订单管理' },
      { key: routerCfg.ERP_ORDER, name: '子订单管理' },
    ],
  },
  { key: routerCfg.PURCHASE, name: '采购管理', icon: 'appstore-o',
    child: [
      { key: routerCfg.PURCHASE_LIST, name: '采购管理' },
      // { key: routerCfg.CHECK,
      //   name: '盘点管理',
      //   child: [
      //     { key: routerCfg.JOURNAL, name: '流水管理' },
      //     { key: routerCfg.RECEIPT, name: '小票管理' },
      //   ],
      // },
      { key: routerCfg.PURCHASE_STORAGE, name: '采购入库管理' },
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
  { key: routerCfg.SYSTEM, name: '系统管理', icon: 'global',
    child: [
      { key: routerCfg.WAREHOUSE, name: '仓库管理' },
    ],
  },
];
